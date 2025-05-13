import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatWidgetOpenComponent from './chat-widget-open';

// Mock localStorage
const localStorageMock = (function () {
  let store: { [key: string]: string } = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock alert
const mockAlert = jest.fn();
window.alert = mockAlert;

// Mock scroll behavior
const scrollTopMock = jest.fn();
Object.defineProperty(HTMLElement.prototype, 'scrollTop', {
  get: jest.fn(),
  set: scrollTopMock,
});
Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
  get: jest.fn(() => 1000),
});

const defaultSettings = {
  botMsgBgColor: '#f3f4f6',
  userMsgBgColor: '#fef08a',
  sendBtnBgColor: '#000000',
  sendBtnIconColor: '#ffffff',
  footerBgColor: '#ffffff',
  footerTextColor: '#374151',
};

const initialMessages = [
  { text: 'Hello!', isUser: false },
  { text: 'Hi there!', isUser: true },
];

describe('ChatWidgetOpenComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  it('renders loading state when settings are not initialized', () => {
    render(<ChatWidgetOpenComponent defaultSettings={defaultSettings} initialMessages={initialMessages} />);
    expect(screen.queryByText('Chat Widget Customization')).not.toBeInTheDocument();
  });

  it('renders with default settings when no saved settings in localStorage', async () => {
    render(<ChatWidgetOpenComponent defaultSettings={defaultSettings} initialMessages={initialMessages} />);
    await waitFor(() => {
      expect(screen.getByText('Chat Widget Customization')).toBeInTheDocument();
      expect(screen.getByLabelText('Bot Message Background Color:')).toHaveValue('#f3f4f6');
      expect(screen.getByLabelText('User Message Background Color:')).toHaveValue('#fef08a');
    });
  });

  it('loads settings from localStorage', async () => {
    const savedSettings = {
      botMsgBgColor: '#123456',
      userMsgBgColor: '#654321',
      sendBtnBgColor: '#111111',
      sendBtnIconColor: '#222222',
      footerBgColor: '#333333',
      footerTextColor: '#444444',
    };
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(savedSettings));
    render(<ChatWidgetOpenComponent defaultSettings={defaultSettings} initialMessages={initialMessages} />);
    await waitFor(() => {
      expect(screen.getByLabelText('Bot Message Background Color:')).toHaveValue('#123456');
      expect(screen.getByLabelText('User Message Background Color:')).toHaveValue('#654321');
    });
  });

  it('falls back to default settings on localStorage parse error', async () => {
    localStorageMock.getItem.mockReturnValueOnce('invalid JSON');
    render(<ChatWidgetOpenComponent defaultSettings={defaultSettings} initialMessages={initialMessages} />);
    await waitFor(() => {
      expect(screen.getByLabelText('Bot Message Background Color:')).toHaveValue('#f3f4f6');
      expect(console.error).toHaveBeenCalledWith('Error parsing localStorage settings:', expect.any(Error));
    });
  });

  it('saves settings to localStorage on settings change', async () => {
    render(<ChatWidgetOpenComponent defaultSettings={defaultSettings} initialMessages={initialMessages} />);
    await waitFor(() => {
      expect(screen.getByLabelText('Bot Message Background Color:')).toBeInTheDocument();
    });
    const input = screen.getByLabelText('Bot Message Background Color:');
    await userEvent.type(input, '{selectall}{backspace}#abcdef');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'chatWidgetSettings',
      JSON.stringify({ ...defaultSettings, botMsgBgColor: '#abcdef' })
    );
  });

  it('updates settings via text input', async () => {
    render(<ChatWidgetOpenComponent defaultSettings={defaultSettings} initialMessages={initialMessages} />);
    await waitFor(() => {
      expect(screen.getByLabelText('Bot Message Background Color:')).toBeInTheDocument();
    });
    const textInput = screen.getByLabelText('Bot Message Background Color:');
    await userEvent.type(textInput, '{selectall}{backspace}#123456');
    expect(screen.getByLabelText('Bot Message Background Color:')).toHaveValue('#123456');
  });

  it('updates settings via color picker', async () => {
    render(<ChatWidgetOpenComponent defaultSettings={defaultSettings} initialMessages={initialMessages} />);
    await waitFor(() => {
      expect(screen.getByLabelText('Bot Message Background Color:')).toBeInTheDocument();
    });
    const colorInput = screen.getAllByLabelText('Bot Message Background Color:')[1]; // Second input is color
    fireEvent.change(colorInput, { target: { value: '#654321' } });
    expect(screen.getByLabelText('Bot Message Background Color:')).toHaveValue('#654321');
  });

  it('sends a message and scrolls to bottom', async () => {
    render(<ChatWidgetOpenComponent defaultSettings={defaultSettings} initialMessages={initialMessages} />);
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
    });
    const input = screen.getByPlaceholderText('Type a message...');
    await userEvent.type(input, 'New message');
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' });
    expect(screen.getByText('New message')).toBeInTheDocument();
    expect(scrollTopMock).toHaveBeenCalledWith(1000);
  });

  it('does not send empty or whitespace-only messages', async () => {
    render(<ChatWidgetOpenComponent defaultSettings={defaultSettings} initialMessages={initialMessages} />);
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
    });
    const input = screen.getByPlaceholderText('Type a message...');
    await userEvent.type(input, '   ');
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' });
    expect(screen.queryByText('   ')).not.toBeInTheDocument();
  });

  it('toggles and uses emoji picker', async () => {
    render(<ChatWidgetOpenComponent defaultSettings={defaultSettings} initialMessages={initialMessages} />);
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
    });
    const emojiButton = screen.getByRole('button', { name: /emoji/i });
    await userEvent.click(emojiButton);
    expect(screen.getByText('😊')).toBeInTheDocument();
    await userEvent.click(screen.getByText('😊'));
    expect(screen.getByPlaceholderText('Type a message...')).toHaveValue('😊');
    expect(screen.queryByText('😊')).not.toBeInTheDocument(); // Picker closed
  });

  it('toggles dropdown menu and triggers actions', async () => {
    render(<ChatWidgetOpenComponent defaultSettings={defaultSettings} initialMessages={initialMessages} />);
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
    });
    const menuButton = screen.getByRole('button', { name: /menu/i });
    await userEvent.click(menuButton);
    expect(screen.getByText('Send transcript')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Send transcript'));
    expect(mockAlert).toHaveBeenCalledWith('Send transcript clicked');
    await userEvent.click(screen.getByText('Move chat to mobile'));
    expect(mockAlert).toHaveBeenCalledWith('Move chat to mobile clicked');
  });

  it('toggles sounds', async () => {
    render(<ChatWidgetOpenComponent defaultSettings={defaultSettings} initialMessages={initialMessages} />);
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
    });
    const menuButton = screen.getByRole('button', { name: /menu/i });
    await userEvent.click(menuButton);
    const soundsToggle = screen.getByRole('checkbox', { name: /sounds/i });
    expect(soundsToggle).toBeChecked();
    await userEvent.click(soundsToggle);
    expect(soundsToggle).not.toBeChecked();
  });

  it('saves settings on save button click', async () => {
    render(<ChatWidgetOpenComponent defaultSettings={defaultSettings} initialMessages={initialMessages} />);
    await waitFor(() => {
      expect(screen.getByText('Save')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByText('Save'));
    expect(mockAlert).toHaveBeenCalledWith('Settings saved successfully!');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'chatWidgetSettings',
      JSON.stringify(defaultSettings)
    );
  });

  it('renders initial messages correctly', async () => {
    render(<ChatWidgetOpenComponent defaultSettings={defaultSettings} initialMessages={initialMessages} />);
    await waitFor(() => {
      expect(screen.getByText('Hello!')).toBeInTheDocument();
      expect(screen.getByText('Hi there!')).toBeInTheDocument();
    });
  });

  it('applies settings to message backgrounds', async () => {
    render(<ChatWidgetOpenComponent defaultSettings={defaultSettings} initialMessages={initialMessages} />);
    await waitFor(() => {
      expect(screen.getByText('Hello!').parentElement).toHaveStyle({ backgroundColor: '#f3f4f6' });
      expect(screen.getByText('Hi there!').parentElement).toHaveStyle({ backgroundColor: '#fef08a' });
    });
  });

  it('applies settings to send button and footer', async () => {
    render(<ChatWidgetOpenComponent defaultSettings={defaultSettings} initialMessages={initialMessages} />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /send/i })).toHaveStyle({
        backgroundColor: '#000000',
        color: '#ffffff',
      });
      expect(screen.getByText('Powered by LiveChat').parentElement).toHaveStyle({
        backgroundColor: '#ffffff',
        color: '#374151',
      });
    });
  });
});