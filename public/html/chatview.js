document.addEventListener("DOMContentLoaded", () => {
    // Input Elements
    const titleInput = document.getElementById("titleInput");
    const textInput = document.getElementById("textInput");
    const bgColorInput = document.getElementById("bgColorInput");
    const textColorInput = document.getElementById("textColorInput");
    const bgColorPicker = document.getElementById("bgColorPicker");
    const textColorPicker = document.getElementById("textColorPicker");

    // Bubble Inputs
    const bubbleBgColorInput = document.getElementById("bubbleBgColorInput");
    const bubbleBgColorText = document.getElementById("bubbleBgColorText");
    const bubbleIconColorInput = document.getElementById("bubbleIconColorInput");
    const bubbleIconColorText = document.getElementById("bubbleIconColorText");
    const bubbleDotsColorInput = document.getElementById("bubbleDotsColorInput");
    const bubbleDotsColorText = document.getElementById("bubbleDotsColorText");

    // Chat Bar Inputs
    const chatBarTextInput = document.getElementById("chatBarTextInput");
    const chatBarBgColorInput = document.getElementById("chatBarBgColorInput");
    const chatBarBgColorText = document.getElementById("chatBarBgColorText");
    const chatBarTextColorInput = document.getElementById("chatBarTextColorInput");
    const chatBarTextColorText = document.getElementById("chatBarTextColorText");

    // Chat Widget Inputs
    const widgetBotMsgBgColorInput = document.getElementById("widgetBotMsgBgColorInput");
    const widgetBotMsgBgColorText = document.getElementById("widgetBotMsgBgColorText");
    const widgetUserMsgBgColorInput = document.getElementById("widgetUserMsgBgColorInput");
    const widgetUserMsgBgColorText = document.getElementById("widgetUserMsgBgColorText");
    const widgetSendBtnBgColorInput = document.getElementById("widgetSendBtnBgColorInput");
    const widgetSendBtnBgColorText = document.getElementById("widgetSendBtnBgColorText");
    const widgetSendBtnIconColorInput = document.getElementById("widgetSendBtnIconColorInput");
    const widgetSendBtnIconColorText = document.getElementById("widgetSendBtnIconColorText");
    const footerBgColorInput = document.getElementById("footerBgColorInput");
    const footerBgColorText = document.getElementById("footerBgColorText");
    const footerTextColorInput = document.getElementById("footerTextColorInput");
    const footerTextColorText = document.getElementById("footerTextColorText");

    // Chat Widget Landing Inputs
    const modalBgColorInput = document.getElementById("modalBgColorInput");
    const modalBgColorText = document.getElementById("modalBgColorText");
    const modalTitleColorInput = document.getElementById("modalTitleColorInput");
    const modalTitleColorText = document.getElementById("modalTitleColorText");
    const chatPreviewBgInput = document.getElementById("chatPreviewBgInput");
    const chatPreviewBgText = document.getElementById("chatPreviewBgText");
    const chatPreviewTextColorInput = document.getElementById("chatPreviewTextColorInput");
    const chatPreviewTextColorText = document.getElementById("chatPreviewTextColorText");
    const chatNowBtnBgInput = document.getElementById("chatNowBtnBgInput");
    const chatNowBtnBgText = document.getElementById("chatNowBtnBgText");
    const chatNowBtnTextColorInput = document.getElementById("chatNowBtnTextColorInput");
    const chatNowBtnTextColorText = document.getElementById("chatNowBtnTextColorText");
    const linkItemBgInput = document.getElementById("linkItemBgInput");
    const linkItemBgText = document.getElementById("linkItemBgText");
    const linkItemTextColorInput = document.getElementById("linkItemTextColorInput");
    const linkItemTextColorText = document.getElementById("linkItemTextColorText");
    const footerButtonsBgInput = document.getElementById("footerButtonsBgInput");
    const footerButtonsBgText = document.getElementById("footerButtonsBgText");
    const footerButtonsIconColorInput = document.getElementById("footerButtonsIconColorInput");
    const footerButtonsIconColorText = document.getElementById("footerButtonsIconColorText");
    const footerBoxBgInput = document.getElementById("footerBoxBgInput");
    const footerBoxBgText = document.getElementById("footerBoxBgText");

    // Preview Elements
    const eyecatcherPreviewBox = document.getElementById("eyecatcherPreviewBox");
    const eyecatcherPreviewTitle = document.getElementById("eyecatcherPreviewTitle");
    const eyecatcherPreviewText = document.getElementById("eyecatcherPreviewText");
    const bubblePreviewBox = document.getElementById("bubblePreviewBox");
    const bubbleIcon = document.getElementById("bubbleIcon");
    const bubbleDots = document.querySelectorAll(".bubble-preview .dot");
    const chatBarPreviewBox = document.getElementById("chatBarPreviewBox");
    const chatBarPreviewText = document.getElementById("chatBarPreviewText");
    const chatWidgetPreviewBox = document.getElementById("chatWidgetPreviewBox");
    const widgetMessagesPreview = document.getElementById("widgetMessagesPreview");
    const widgetMessageInput = document.getElementById("widgetMessageInput");
    const widgetSendButton = document.querySelector(".send-button");
    const chatFooter = document.querySelector(".chat-footer");
    const modalLandingBg = document.querySelector(".modal-landing-bg");
    const modalTitle = document.getElementById("modalTitle");
    const chatPreviewBg = document.querySelector(".chat-preview-bg");
    const chatPreviewTexts = document.querySelectorAll(".chat-preview-text");
    const chatNowBtnBg = document.querySelector(".chat-now-btn-bg");
    const chatNowBtnText = document.querySelector(".chat-now-btn-text");
    const linkItemsBg = document.querySelectorAll(".link-item-bg");
    const linkItemsText = document.querySelectorAll(".link-item-text");
    const homeButton = document.getElementById("homeButton");
    const liveChatButton = document.getElementById("liveChatButton");
    const footerBox = document.querySelector(".footer-box");

    // Input Section Elements
    const eyecatcherInputs = document.getElementById("eyecatcherInputs");
    const bubbleInputs = document.getElementById("bubbleInputs");
    const chatBarInputs = document.getElementById("chatBarInputs");
    const chatWidgetInputs = document.getElementById("chatWidgetInputs");
    const chatWidgetOpenInputs = document.getElementById("chatWidgetOpenInputs");
    const chatWidgetLandingInputs = document.getElementById("chatWidgetLandingInputs");
    const chatWidgetOpenContent = document.getElementById("chatWidgetOpenContent");
    const homeContent = document.getElementById("homeContent");

    // Radio Buttons
    const radioButtons = document.querySelectorAll('input[name="chat_option"]');

    // Dropdown Menu Toggle
    const moreOptionsButton = document.querySelector(".more-options-button");
    const dropdownMenu = document.getElementById("dropdownMenu");

    if (moreOptionsButton) {
        moreOptionsButton.addEventListener("click", () => {
            dropdownMenu.classList.toggle("active");
        });
    }

    document.addEventListener("click", (event) => {
        if (moreOptionsButton && dropdownMenu && !moreOptionsButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove("active");
        }
    });

    // Message Sending Functionality
    function sendMessage() {
        if (widgetMessageInput.value.trim() === "") return;

        const messageText = widgetMessageInput.value;
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("chat-message", "user");
        messageDiv.innerHTML = `<div>${messageText}</div>`;
        widgetMessagesPreview.appendChild(messageDiv);

        if (widgetUserMsgBgColorText) {
            messageDiv.querySelector("div").style.backgroundColor = widgetUserMsgBgColorText.value;
        }

        widgetMessageInput.value = "";
        widgetMessagesPreview.scrollTop = widgetMessagesPreview.scrollHeight;
    }

    if (widgetSendButton) {
        widgetSendButton.addEventListener("click", sendMessage);
    }

    if (widgetMessageInput) {
        widgetMessageInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                sendMessage();
            }
        });
    }

    // Handle Radio Button Changes
    function handleRadioChange() {
        const selectedOption = document.querySelector('input[name="chat_option"]:checked').value;

        // Hide all preview boxes
        eyecatcherPreviewBox.style.display = "none";
        bubblePreviewBox.style.display = "none";
        chatBarPreviewBox.style.display = "none";
        chatWidgetPreviewBox.style.display = "none";
        chatWidgetOpenContent.style.display = "none";
        homeContent.style.display = "none";

        // Hide all input sections
        eyecatcherInputs.style.display = "none";
        bubbleInputs.style.display = "none";
        chatBarInputs.style.display = "none";
        chatWidgetInputs.style.display = "none";
        chatWidgetOpenInputs.style.display = "none";
        chatWidgetLandingInputs.style.display = "none";

        // Show the selected preview and inputs
        switch (selectedOption) {
            case "eyecatcher":
                eyecatcherPreviewBox.style.display = "flex";
                eyecatcherInputs.style.display = "block";
                break;
            case "bubble":
                bubblePreviewBox.style.display = "flex";
                bubbleInputs.style.display = "block";
                break;
            case "chat_bar":
                chatBarPreviewBox.style.display = "flex";
                chatBarInputs.style.display = "block";
                break;
            case "chat_widget":
                chatWidgetPreviewBox.style.display = "flex";
                chatWidgetInputs.style.display = "block";
                chatWidgetOpenInputs.style.display = "block";
                chatWidgetOpenContent.style.display = "flex";
                break;
            case "chat_widget_landing":
                chatWidgetPreviewBox.style.display = "flex";
                chatWidgetInputs.style.display = "block";
                chatWidgetLandingInputs.style.display = "block";
                homeContent.style.display = "flex";
                break;
        }
    }

    // Add event listeners to radio buttons
    radioButtons.forEach(radio => {
        radio.addEventListener("change", handleRadioChange);
    });

    // Load settings from localStorage
    function loadSettings() {
        try {
            const savedSettings = localStorage.getItem("chatSettings");
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);

                // Restore selected radio button
                if (settings.selectedOption) {
                    const radioToCheck = document.querySelector(`input[name="chat_option"][value="${settings.selectedOption}"]`);
                    if (radioToCheck) {
                        radioToCheck.checked = true;
                        handleRadioChange();
                    }
                }

                // Apply Eyecatcher settings
                if (titleInput) titleInput.value = settings.eyecatcher.title || "";
                if (textInput) textInput.value = settings.eyecatcher.text || "";
                if (bgColorInput) bgColorInput.value = settings.eyecatcher.bgColor || "#007bff";
                if (textColorInput) textColorInput.value = settings.eyecatcher.textColor || "#ffffff";
                if (bgColorPicker) bgColorPicker.value = bgColorInput.value;
                if (textColorPicker) textColorPicker.value = textColorInput.value;
                if (eyecatcherPreviewTitle) eyecatcherPreviewTitle.textContent = titleInput.value || "Hello";
                if (eyecatcherPreviewText) eyecatcherPreviewText.textContent = textInput.value || "Click to chat";
                if (eyecatcherPreviewBox) eyecatcherPreviewBox.style.backgroundColor = bgColorInput.value;
                if (eyecatcherPreviewBox) eyecatcherPreviewBox.style.color = textColorInput.value;

                // Apply Bubble settings
                if (bubbleBgColorText) bubbleBgColorText.value = settings.bubble.bgColor || "#ff5101";
                if (bubbleIconColorText) bubbleIconColorText.value = settings.bubble.iconColor || "#ffffff";
                if (bubbleDotsColorText) bubbleDotsColorText.value = settings.bubble.dotsColor || "#ff5101";
                if (bubbleBgColorInput) bubbleBgColorInput.value = bubbleBgColorText.value;
                if (bubbleIconColorInput) bubbleIconColorInput.value = bubbleIconColorText.value;
                if (bubbleDotsColorInput) bubbleDotsColorInput.value = bubbleDotsColorText.value;
                if (bubblePreviewBox) bubblePreviewBox.style.backgroundColor = bubbleBgColorText.value;
                if (bubbleIcon) {
                    bubbleIcon.querySelectorAll("path").forEach(path => {
                        path.setAttribute("fill", bubbleIconColorText.value);
                    });
                }
                bubbleDots.forEach(dot => {
                    dot.style.backgroundColor = bubbleDotsColorText.value;
                });

                // Apply Chat Bar settings
                if (chatBarTextInput) chatBarTextInput.value = settings.chatBar.text || "";
                if (chatBarBgColorText) chatBarBgColorText.value = settings.chatBar.bgColor || "#007bff";
                if (chatBarTextColorText) chatBarTextColorText.value = settings.chatBar.textColor || "#ffffff";
                if (chatBarBgColorInput) chatBarBgColorInput.value = chatBarBgColorText.value;
                if (chatBarTextColorInput) chatBarTextColorInput.value = chatBarTextColorText.value;
                if (chatBarPreviewText) chatBarPreviewText.textContent = chatBarTextInput.value || "Chat with us";
                if (chatBarPreviewBox) chatBarPreviewBox.style.backgroundColor = chatBarBgColorText.value;
                if (chatBarPreviewBox) chatBarPreviewBox.style.color = chatBarTextColorText.value;

                // Apply Chat Widget settings
                if (widgetBotMsgBgColorText) widgetBotMsgBgColorText.value = settings.chatWidget.botMsgBgColor || "#f3f4f6";
                if (widgetUserMsgBgColorText) widgetUserMsgBgColorText.value = settings.chatWidget.userMsgBgColor || "#fef08a";
                if (widgetSendBtnBgColorText) widgetSendBtnBgColorText.value = settings.chatWidget.sendBtnBgColor || "#000000";
                if (widgetSendBtnIconColorText) widgetSendBtnIconColorText.value = settings.chatWidget.sendBtnIconColor || "#ffffff";
                if (footerBgColorText) footerBgColorText.value = settings.chatWidget.footerBgColor || "#ffffff";
                if (footerTextColorText) footerTextColorText.value = settings.chatWidget.footerTextColor || "#374151";
                if (modalBgColorText) modalBgColorText.value = settings.chatWidget.modalBgColor || "#d3d3d3";
                if (modalTitleColorText) modalTitleColorText.value = settings.chatWidget.modalTitleColor || "#000000";
                if (chatPreviewBgText) chatPreviewBgText.value = settings.chatWidget.chatPreviewBg || "#f3f4f6";
                if (chatPreviewTextColorText) chatPreviewTextColorText.value = settings.chatWidget.chatPreviewTextColor || "#374151";
                if (chatNowBtnBgText) chatNowBtnBgText.value = settings.chatWidget.chatNowBtnBg || "#000000";
                if (chatNowBtnTextColorText) chatNowBtnTextColorText.value = settings.chatWidget.chatNowBtnTextColor || "#ffffff";
                if (linkItemBgText) linkItemBgText.value = settings.chatWidget.linkItemBg || "#f3f4f6";
                if (linkItemTextColorText) linkItemTextColorText.value = settings.chatWidget.linkItemTextColor || "#374151";
                if (footerBoxBgText) footerBoxBgText.value = settings.chatWidget.footerBoxBg || "#ffffff";
                if (footerButtonsBgText) footerButtonsBgText.value = settings.chatWidget.footerButtonsBg || "#f3f4f6";
                if (footerButtonsIconColorText) footerButtonsIconColorText.value = settings.chatWidget.footerButtonsIconColor || "#374151";

                // Update preview elements
                updatePreviewElements();
                console.log("Settings loaded from localStorage:", settings);
            } else {
                console.log("No settings found in localStorage.");
            }
        } catch (error) {
            console.error("Error loading settings from localStorage:", error);
            alert("Failed to load settings. Please check the console for details.");
        }
    }

    // Update preview elements based on input values
    function updatePreviewElements() {
        // Update Eyecatcher
        if (eyecatcherPreviewTitle && titleInput) eyecatcherPreviewTitle.textContent = titleInput.value || "Hello";
        if (eyecatcherPreviewText && textInput) eyecatcherPreviewText.textContent = textInput.value || "Click to chat";
        if (eyecatcherPreviewBox && bgColorInput) eyecatcherPreviewBox.style.backgroundColor = bgColorInput.value;
        if (eyecatcherPreviewBox && textColorInput) eyecatcherPreviewBox.style.color = textColorInput.value;

        // Update Bubble
        if (bubblePreviewBox && bubbleBgColorText) bubblePreviewBox.style.backgroundColor = bubbleBgColorText.value;
        if (bubbleIcon && bubbleIconColorText) {
            bubbleIcon.querySelectorAll("path").forEach(path => {
                path.setAttribute("fill", bubbleIconColorText.value);
            });
        }
        if (bubbleDots && bubbleDotsColorText) {
            bubbleDots.forEach(dot => {
                dot.style.backgroundColor = bubbleDotsColorText.value;
            });
        }

        // Update Chat Bar
        if (chatBarPreviewText && chatBarTextInput) chatBarPreviewText.textContent = chatBarTextInput.value || "Chat with us";
        if (chatBarPreviewBox && chatBarBgColorText) chatBarPreviewBox.style.backgroundColor = chatBarBgColorText.value;
        if (chatBarPreviewBox && chatBarTextColorText) chatBarPreviewBox.style.color = chatBarTextColorText.value;

        // Update Chat Widget
        if (widgetMessagesPreview && widgetBotMsgBgColorText) {
            widgetMessagesPreview.querySelectorAll(".chat-message:not(.user) > div").forEach(div => {
                div.style.backgroundColor = widgetBotMsgBgColorText.value;
            });
        }
        if (widgetMessagesPreview && widgetUserMsgBgColorText) {
            widgetMessagesPreview.querySelectorAll(".chat-message.user > div").forEach(div => {
                div.style.backgroundColor = widgetUserMsgBgColorText.value;
            });
        }
        if (widgetSendButton && widgetSendBtnBgColorText) {
            widgetSendButton.style.backgroundColor = widgetSendBtnBgColorText.value;
        }
        if (widgetSendButton && widgetSendBtnIconColorText) {
            widgetSendButton.style.color = widgetSendBtnIconColorText.value;
        }
        if (chatFooter && footerBgColorText) {
            chatFooter.style.backgroundColor = footerBgColorText.value;
        }
        if (chatFooter && footerTextColorText) {
            chatFooter.style.color = footerTextColorText.value;
        }

        // Update Chat Widget Landing
        if (modalLandingBg && modalBgColorText) {
            modalLandingBg.style.background = `linear-gradient(to bottom, ${modalBgColorText.value}, #e8e8e8)`;
        }
        if (modalTitle && modalTitleColorText) {
            modalTitle.style.color = modalTitleColorText.value;
        }
        if (chatPreviewBg && chatPreviewBgText) {
            chatPreviewBg.style.backgroundColor = chatPreviewBgText.value;
        }
        if (chatPreviewTexts && chatPreviewTextColorText) {
            chatPreviewTexts.forEach(text => {
                text.style.color = chatPreviewTextColorText.value;
            });
        }
        if (chatNowBtnBg && chatNowBtnBgText) {
            chatNowBtnBg.style.backgroundColor = chatNowBtnBgText.value;
        }
        if (chatNowBtnText && chatNowBtnTextColorText) {
            chatNowBtnBg.style.color = chatNowBtnTextColorText.value;
            chatNowBtnText.style.fill = chatNowBtnTextColorText.value;
        }
        if (linkItemsBg && linkItemBgText) {
            linkItemsBg.forEach(item => {
                item.style.backgroundColor = linkItemBgText.value;
            });
        }
        if (linkItemsText && linkItemTextColorText) {
            linkItemsText.forEach(text => {
                text.style.color = linkItemTextColorText.value;
            });
        }
        if (footerBox && footerBoxBgText) {
            footerBox.style.backgroundColor = footerBoxBgText.value;
        }
        if (homeButton && footerButtonsBgText) {
            homeButton.style.backgroundColor = footerButtonsBgText.value;
        }
        if (liveChatButton && footerButtonsBgText) {
            liveChatButton.style.backgroundColor = footerButtonsBgText.value;
        }
        if (homeButton && footerButtonsIconColorText) {
            homeButton.style.color = footerButtonsIconColorText.value;
            homeButton.querySelectorAll("svg path").forEach(path => {
                path.setAttribute("fill", footerButtonsIconColorText.value);
                path.setAttribute("stroke", footerButtonsIconColorText.value);
            });
        }
        if (liveChatButton && footerButtonsIconColorText) {
            liveChatButton.style.color = footerButtonsIconColorText.value;
            liveChatButton.querySelectorAll("svg path").forEach(path => {
                path.setAttribute("fill", footerButtonsIconColorText.value);
                path.setAttribute("stroke", footerButtonsIconColorText.value);
            });
        }
    }

    // Save settings to localStorage
    function saveSettings() {
        try {
            const settings = {
                selectedOption: document.querySelector('input[name="chat_option"]:checked')?.value || "eyecatcher",
                eyecatcher: {
                    title: titleInput?.value || "",
                    text: textInput?.value || "",
                    bgColor: bgColorInput?.value || "#007bff",
                    textColor: textColorInput?.value || "#ffffff"
                },
                bubble: {
                    bgColor: bubbleBgColorText?.value || "#ff5101",
                    iconColor: bubbleIconColorText?.value || "#ffffff",
                    dotsColor: bubbleDotsColorText?.value || "#ff5101"
                },
                chatBar: {
                    text: chatBarTextInput?.value || "",
                    bgColor: chatBarBgColorText?.value || "#007bff",
                    textColor: chatBarTextColorText?.value || "#ffffff"
                },
                chatWidget: {
                    botMsgBgColor: widgetBotMsgBgColorText?.value || "#f3f4f6",
                    userMsgBgColor: widgetUserMsgBgColorText?.value || "#fef08a",
                    sendBtnBgColor: widgetSendBtnBgColorText?.value || "#000000",
                    sendBtnIconColor: widgetSendBtnIconColorText?.value || "#ffffff",
                    footerBgColor: footerBgColorText?.value || "#ffffff",
                    footerTextColor: footerTextColorText?.value || "#374151",
                    modalBgColor: modalBgColorText?.value || "#d3d3d3",
                    modalTitleColor: modalTitleColorText?.value || "#000000",
                    chatPreviewBg: chatPreviewBgText?.value || "#f3f4f6",
                    chatPreviewTextColor: chatPreviewTextColorText?.value || "#374151",
                    chatNowBtnBg: chatNowBtnBgText?.value || "#000000",
                    chatNowBtnTextColor: chatNowBtnTextColorText?.value || "#ffffff",
                    linkItemBg: linkItemBgText?.value || "#f3f4f6",
                    linkItemTextColor: linkItemTextColorText?.value || "#374151",
                    footerBoxBg: footerBoxBgText?.value || "#ffffff",
                    footerButtonsBg: footerButtonsBgText?.value || "#f3f4f6",
                    footerButtonsIconColor: footerButtonsIconColorText?.value || "#374151"
                }
            };
            localStorage.setItem("chatSettings", JSON.stringify(settings));
            console.log("Settings saved to localStorage:", settings);
            alert("Settings saved!");
        } catch (error) {
            console.error("Error saving settings to localStorage:", error);
            alert("Failed to save settings. Please check the console for details.");
        }
    }

    // Event Listeners for Input Changes
    function setupInputListeners() {
        // Eyecatcher Inputs
        if (titleInput) {
            titleInput.addEventListener("input", () => {
                eyecatcherPreviewTitle.textContent = titleInput.value || "Hello";
            });
        }
        if (textInput) {
            textInput.addEventListener("input", () => {
                eyecatcherPreviewText.textContent = textInput.value || "Click to chat";
            });
        }
        if (bgColorInput) {
            bgColorInput.addEventListener("input", () => {
                bgColorPicker.value = bgColorInput.value;
                eyecatcherPreviewBox.style.backgroundColor = bgColorInput.value;
            });
        }
        if (bgColorPicker) {
            bgColorPicker.addEventListener("input", () => {
                bgColorInput.value = bgColorPicker.value;
                eyecatcherPreviewBox.style.backgroundColor = bgColorPicker.value;
            });
        }
        if (textColorInput) {
            textColorInput.addEventListener("input", () => {
                textColorPicker.value = textColorInput.value;
                eyecatcherPreviewBox.style.color = textColorInput.value;
            });
        }
        if (textColorPicker) {
            textColorPicker.addEventListener("input", () => {
                textColorInput.value = textColorPicker.value;
                eyecatcherPreviewBox.style.color = textColorPicker.value;
            });
        }

        // Bubble Inputs
        if (bubbleBgColorText) {
            bubbleBgColorText.addEventListener("input", () => {
                bubbleBgColorInput.value = bubbleBgColorText.value;
                bubblePreviewBox.style.backgroundColor = bubbleBgColorText.value;
            });
        }
        if (bubbleBgColorInput) {
            bubbleBgColorInput.addEventListener("input", () => {
                bubbleBgColorText.value = bubbleBgColorInput.value;
                bubblePreviewBox.style.backgroundColor = bubbleBgColorInput.value;
            });
        }
        if (bubbleIconColorText) {
            bubbleIconColorText.addEventListener("input", () => {
                bubbleIconColorInput.value = bubbleIconColorText.value;
                bubbleIcon.querySelectorAll("path").forEach(path => {
                    path.setAttribute("fill", bubbleIconColorText.value);
                });
            });
        }
        if (bubbleIconColorInput) {
            bubbleIconColorInput.addEventListener("input", () => {
                bubbleIconColorText.value = bubbleIconColorInput.value;
                bubbleIcon.querySelectorAll("path").forEach(path => {
                    path.setAttribute("fill", bubbleIconColorInput.value);
                });
            });
        }
        if (bubbleDotsColorText) {
            bubbleDotsColorText.addEventListener("input", () => {
                bubbleDotsColorInput.value = bubbleDotsColorText.value;
                bubbleDots.forEach(dot => {
                    dot.style.backgroundColor = bubbleDotsColorText.value;
                });
            });
        }
        if (bubbleDotsColorInput) {
            bubbleDotsColorInput.addEventListener("input", () => {
                bubbleDotsColorText.value = bubbleDotsColorInput.value;
                bubbleDots.forEach(dot => {
                    dot.style.backgroundColor = bubbleDotsColorInput.value;
                });
            });
        }

        // Chat Bar Inputs
        if (chatBarTextInput) {
            chatBarTextInput.addEventListener("input", () => {
                chatBarPreviewText.textContent = chatBarTextInput.value || "Chat with us";
            });
        }
        if (chatBarBgColorText) {
            chatBarBgColorText.addEventListener("input", () => {
                chatBarBgColorInput.value = chatBarBgColorText.value;
                chatBarPreviewBox.style.backgroundColor = chatBarBgColorText.value;
            });
        }
        if (chatBarBgColorInput) {
            chatBarBgColorInput.addEventListener("input", () => {
                chatBarBgColorText.value = chatBarBgColorInput.value;
                chatBarPreviewBox.style.backgroundColor = chatBarBgColorInput.value;
            });
        }
        if (chatBarTextColorText) {
            chatBarTextColorText.addEventListener("input", () => {
                chatBarTextColorInput.value = chatBarTextColorText.value;
                chatBarPreviewBox.style.color = chatBarTextColorText.value;
            });
        }
        if (chatBarTextColorInput) {
            chatBarTextColorInput.addEventListener("input", () => {
                chatBarTextColorText.value = chatBarTextColorInput.value;
                chatBarPreviewBox.style.color = chatBarTextColorInput.value;
            });
        }

        // Chat Widget Inputs
        if (widgetBotMsgBgColorText) {
            widgetBotMsgBgColorText.addEventListener("input", () => {
                widgetBotMsgBgColorInput.value = widgetBotMsgBgColorText.value;
                widgetMessagesPreview.querySelectorAll(".chat-message:not(.user) > div").forEach(div => {
                    div.style.backgroundColor = widgetBotMsgBgColorText.value;
                });
            });
        }
        if (widgetBotMsgBgColorInput) {
            widgetBotMsgBgColorInput.addEventListener("input", () => {
                widgetBotMsgBgColorText.value = widgetBotMsgBgColorInput.value;
                widgetMessagesPreview.querySelectorAll(".chat-message:not(.user) > div").forEach(div => {
                    div.style.backgroundColor = widgetBotMsgBgColorInput.value;
                });
            });
        }
        if (widgetUserMsgBgColorText) {
            widgetUserMsgBgColorText.addEventListener("input", () => {
                widgetUserMsgBgColorInput.value = widgetUserMsgBgColorText.value;
                widgetMessagesPreview.querySelectorAll(".chat-message.user > div").forEach(div => {
                    div.style.backgroundColor = widgetUserMsgBgColorText.value;
                });
            });
        }
        if (widgetUserMsgBgColorInput) {
            widgetUserMsgBgColorInput.addEventListener("input", () => {
                widgetUserMsgBgColorText.value = widgetUserMsgBgColorInput.value;
                widgetMessagesPreview.querySelectorAll(".chat-message.user > div").forEach(div => {
                    div.style.backgroundColor = widgetUserMsgBgColorInput.value;
                });
            });
        }
        if (widgetSendBtnBgColorText) {
            widgetSendBtnBgColorText.addEventListener("input", () => {
                widgetSendBtnBgColorInput.value = widgetSendBtnBgColorText.value;
                widgetSendButton.style.backgroundColor = widgetSendBtnBgColorText.value;
            });
        }
        if (widgetSendBtnBgColorInput) {
            widgetSendBtnBgColorInput.addEventListener("input", () => {
                widgetSendBtnBgColorText.value = widgetSendBtnBgColorInput.value;
                widgetSendButton.style.backgroundColor = widgetSendBtnBgColorInput.value;
            });
        }
        if (widgetSendBtnIconColorText) {
            widgetSendBtnIconColorText.addEventListener("input", () => {
                widgetSendBtnIconColorInput.value = widgetSendBtnIconColorText.value;
                widgetSendButton.style.color = widgetSendBtnIconColorText.value;
            });
        }
        if (widgetSendBtnIconColorInput) {
            widgetSendBtnIconColorInput.addEventListener("input", () => {
                widgetSendBtnIconColorText.value = widgetSendBtnIconColorInput.value;
                widgetSendButton.style.color = widgetSendBtnIconColorInput.value;
            });
        }
        if (footerBgColorText) {
            footerBgColorText.addEventListener("input", () => {
                footerBgColorInput.value = footerBgColorText.value;
                chatFooter.style.backgroundColor = footerBgColorText.value;
            });
        }
        if (footerBgColorInput) {
            footerBgColorInput.addEventListener("input", () => {
                footerBgColorText.value = footerBgColorInput.value;
                chatFooter.style.backgroundColor = footerBgColorInput.value;
            });
        }
        if (footerTextColorText) {
            footerTextColorText.addEventListener("input", () => {
                footerTextColorInput.value = footerTextColorText.value;
                chatFooter.style.color = footerTextColorText.value;
            });
        }
        if (footerTextColorInput) {
            footerTextColorInput.addEventListener("input", () => {
                footerTextColorText.value = footerTextColorInput.value;
                chatFooter.style.color = footerTextColorInput.value;
            });
        }

        // Chat Widget Landing Inputs
        if (modalBgColorText) {
            modalBgColorText.addEventListener("input", () => {
                modalBgColorInput.value = modalBgColorText.value;
                modalLandingBg.style.background = `linear-gradient(to bottom, ${modalBgColorText.value}, #e8e8e8)`;
            });
        }
        if (modalBgColorInput) {
            modalBgColorInput.addEventListener("input", () => {
                modalBgColorText.value = modalBgColorInput.value;
                modalLandingBg.style.background = `linear-gradient(to bottom, ${modalBgColorInput.value}, #e8e8e8)`;
            });
        }
        if (modalTitleColorText) {
            modalTitleColorText.addEventListener("input", () => {
                modalTitleColorInput.value = modalTitleColorText.value;
                modalTitle.style.color = modalTitleColorText.value;
            });
        }
        if (modalTitleColorInput) {
            modalTitleColorInput.addEventListener("input", () => {
                modalTitleColorText.value = modalTitleColorInput.value;
                modalTitle.style.color = modalTitleColorInput.value;
            });
        }
        if (chatPreviewBgText) {
            chatPreviewBgText.addEventListener("input", () => {
                chatPreviewBgInput.value = chatPreviewBgText.value;
                chatPreviewBg.style.backgroundColor = chatPreviewBgText.value;
            });
        }
        if (chatPreviewBgInput) {
            chatPreviewBgInput.addEventListener("input", () => {
                chatPreviewBgText.value = chatPreviewBgInput.value;
                chatPreviewBg.style.backgroundColor = chatPreviewBgInput.value;
            });
        }
        if (chatPreviewTextColorText) {
            chatPreviewTextColorText.addEventListener("input", () => {
                chatPreviewTextColorInput.value = chatPreviewTextColorText.value;
                chatPreviewTexts.forEach(text => {
                    text.style.color = chatPreviewTextColorText.value;
                });
            });
        }
        if (chatPreviewTextColorInput) {
            chatPreviewTextColorInput.addEventListener("input", () => {
                chatPreviewTextColorText.value = chatPreviewTextColorInput.value;
                chatPreviewTexts.forEach(text => {
                    text.style.color = chatPreviewTextColorInput.value;
                });
            });
        }
        if (chatNowBtnBgText) {
            chatNowBtnBgText.addEventListener("input", () => {
                chatNowBtnBgInput.value = chatNowBtnBgText.value;
                chatNowBtnBg.style.backgroundColor = chatNowBtnBgText.value;
            });
        }
        if (chatNowBtnBgInput) {
            chatNowBtnBgInput.addEventListener("input", () => {
                chatNowBtnBgText.value = chatNowBtnBgInput.value;
                chatNowBtnBg.style.backgroundColor = chatNowBtnBgInput.value;
            });
        }
        if (chatNowBtnTextColorText) {
            chatNowBtnTextColorText.addEventListener("input", () => {
                chatNowBtnTextColorInput.value = chatNowBtnTextColorText.value;
                chatNowBtnBg.style.color = chatNowBtnTextColorText.value;
                chatNowBtnText.style.fill = chatNowBtnTextColorText.value;
            });
        }
        if (chatNowBtnTextColorInput) {
            chatNowBtnTextColorInput.addEventListener("input", () => {
                chatNowBtnTextColorText.value = chatNowBtnTextColorInput.value;
                chatNowBtnBg.style.color = chatNowBtnTextColorText.value;
                chatNowBtnText.style.fill = chatNowBtnTextColorText.value;
            });
        }
        if (linkItemBgText) {
            linkItemBgText.addEventListener("input", () => {
                linkItemBgInput.value = linkItemBgText.value;
                linkItemsBg.forEach(item => {
                    item.style.backgroundColor = linkItemBgText.value;
                });
            });
        }
        if (linkItemBgInput) {
            linkItemBgInput.addEventListener("input", () => {
                linkItemBgText.value = linkItemBgInput.value;
                linkItemsBg.forEach(item => {
                    item.style.backgroundColor = linkItemBgInput.value;
                });
            });
        }
        if (linkItemTextColorText) {
            linkItemTextColorText.addEventListener("input", () => {
                linkItemTextColorInput.value = linkItemTextColorText.value;
                linkItemsText.forEach(text => {
                    text.style.color = linkItemTextColorText.value;
                });
            });
        }
        if (linkItemTextColorInput) {
            linkItemTextColorInput.addEventListener("input", () => {
                linkItemTextColorText.value = linkItemTextColorInput.value;
                linkItemsText.forEach(text => {
                    text.style.color = linkItemTextColorInput.value;
                });
            });
        }
        if (footerBoxBgText) {
            footerBoxBgText.addEventListener("input", () => {
                footerBoxBgInput.value = footerBoxBgText.value;
                footerBox.style.backgroundColor = footerBoxBgText.value;
            });
        }
        if (footerBoxBgInput) {
            footerBoxBgInput.addEventListener("input", () => {
                footerBoxBgText.value = footerBoxBgInput.value;
                footerBox.style.backgroundColor = footerBoxBgInput.value;
            });
        }
        if (footerButtonsBgText) {
            footerButtonsBgText.addEventListener("input", () => {
                footerButtonsBgInput.value = footerButtonsBgText.value;
                homeButton.style.backgroundColor = footerButtonsBgText.value;
                liveChatButton.style.backgroundColor = footerButtonsBgText.value;
            });
        }
        if (footerButtonsBgInput) {
            footerButtonsBgInput.addEventListener("input", () => {
                footerButtonsBgText.value = footerButtonsBgInput.value;
                homeButton.style.backgroundColor = footerButtonsBgInput.value;
                liveChatButton.style.backgroundColor = footerButtonsBgInput.value;
            });
        }
        if (footerButtonsIconColorText) {
            footerButtonsIconColorText.addEventListener("input", () => {
                footerButtonsIconColorInput.value = footerButtonsIconColorText.value;
                homeButton.style.color = footerButtonsIconColorText.value;
                liveChatButton.style.color = footerButtonsIconColorText.value;
                homeButton.querySelectorAll("svg path").forEach(path => {
                    path.setAttribute("fill", footerButtonsIconColorText.value);
                    path.setAttribute("stroke", footerButtonsIconColorText.value);
                });
                liveChatButton.querySelectorAll("svg path").forEach(path => {
                    path.setAttribute("fill", footerButtonsIconColorText.value);
                    path.setAttribute("stroke", footerButtonsIconColorText.value);
                });
            });
        }
        if (footerButtonsIconColorInput) {
            footerButtonsIconColorInput.addEventListener("input", () => {
                footerButtonsIconColorText.value = footerButtonsIconColorInput.value;
                homeButton.style.color = footerButtonsIconColorInput.value;
                liveChatButton.style.color = footerButtonsIconColorInput.value;
                homeButton.querySelectorAll("svg path").forEach(path => {
                    path.setAttribute("fill", footerButtonsIconColorInput.value);
                    path.setAttribute("stroke", footerButtonsIconColorInput.value);
                });
                liveChatButton.querySelectorAll("svg path").forEach(path => {
                    path.setAttribute("fill", footerButtonsIconColorInput.value);
                    path.setAttribute("stroke", footerButtonsIconColorInput.value);
                });
            });
        }
    }

    // Initialize
    loadSettings();
    setupInputListeners();
    handleRadioChange(); // Ensure the correct preview is shown on page load

    // Save Button
    const saveBtn = document.getElementById("saveBtn");
    if (saveBtn) {
        saveBtn.addEventListener("click", () => {
            console.log("Save button clicked");
            saveSettings();
        });
    } else {
        console.error("Save button not found in the DOM");
    }

    // Emoji Picker Functionality
    const emojiButton = document.querySelector(".emoji-button");
    const emojiPicker = document.getElementById("emojiPicker");
    if (emojiButton) {
        emojiButton.addEventListener("click", () => {
            if (emojiPicker) emojiPicker.classList.toggle("hidden");
        });
    }
    if (emojiPicker) {
        emojiPicker.querySelectorAll("span").forEach(span => {
            span.addEventListener("click", () => {
                if (widgetMessageInput) widgetMessageInput.value += span.dataset.emoji;
                if (emojiPicker) emojiPicker.classList.add("hidden");
            });
        });
    }
});