// src/app/api/download-preview/route.ts
import { NextResponse } from 'next/server';
import JSZip from 'jszip';
import fs from 'fs';
import path from 'path';

type PreviewType = 'chatWidget' | 'bubble' | 'chatBar';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, settings } = body as { type: PreviewType; settings: any };

    if (!type) return NextResponse.json({ error: 'Missing type' }, { status: 400 });

    const zip = new JSZip();

    // 1️⃣ Add settings.json
    zip.file('settings.json', JSON.stringify(settings, null, 2));

    // 2️⃣ Map preview type → component file & folder
    const componentFileMap: Record<PreviewType, string> = {
      chatWidget: 'ChatWidgetPreview.tsx',
      bubble: 'BubblePreview.tsx',
      chatBar: 'ChatBarPreview.tsx',
    };
    const componentDirMap: Record<PreviewType, string> = {
      chatWidget: path.join(process.cwd(), 'src', 'components', 'pixel-modifier', 'chatwidget'),
      bubble: path.join(process.cwd(), 'src', 'components', 'pixel-modifier', 'bubble'),
      chatBar: path.join(process.cwd(), 'src', 'components', 'pixel-modifier', 'chatbar'),
    };

    const componentsDir = componentDirMap[type];
    const componentFile = componentFileMap[type];
    const componentContent = fs.readFileSync(path.join(componentsDir, componentFile), 'utf-8');
    zip.file(componentFile, componentContent);

    // 3️⃣ Add type files
 /*    const typeFilesMap: Record<PreviewType, string[]> = {
      chatWidget: ['chat-widget-types.ts'],
      bubble: ['bubbletype.ts'],
      chatBar: ['chatbartype.ts'],
    };

    for (const f of typeFilesMap[type] || []) {
      const typeContent = fs.readFileSync(path.join(process.cwd(), 'src', 'types', f), 'utf-8');
      zip.file(f, typeContent);
    } */

    // 4️⃣ Generate page.tsx
    const pageContent = `
'use client';
import React from 'react';
import ${componentFile.replace('.tsx', '')} from './${componentFile}';
import settings from './settings.json';

export default function Page() {
  return <${componentFile.replace('.tsx', '')} settings={settings} />;
}
    `;
    zip.file('page.tsx', pageContent.trim());

    // 5️⃣ Generate ZIP buffer
    const zipContent = await zip.generateAsync({ type: 'nodebuffer' });

    return new NextResponse(new Uint8Array(zipContent), {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename=${type}-preview.zip`,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
