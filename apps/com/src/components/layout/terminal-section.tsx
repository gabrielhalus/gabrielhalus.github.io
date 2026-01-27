"use client";

import { Play, Square, Terminal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

const commands = [
  {
    command: "npm create next-app@latest",
    output: "Creating a new Next.js app...\n✓ Project initialized successfully",
  },
  {
    command: "docker-compose up -d",
    output: "Starting services...\n✓ PostgreSQL started\n✓ Redis started\n✓ App ready",
  },
  {
    command: "cargo build --release",
    output: "Compiling Rust application...\n✓ Optimized build completed",
  },
  {
    command: "kubectl apply -f deployment.yaml",
    output: "Deploying to cluster...\n✓ Pods: 3/3 ready",
  },
];

export function TerminalSection() {
  const t = useTranslations("terminal");
  const devItems = t.raw("devItems") as string[];
  const deployItems = t.raw("deployItems") as string[];

  const [currentCommand, setCurrentCommand] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState("");

  const runCommand = useCallback(async () => {
    if (isRunning) return;

    setIsRunning(true);
    setOutput("");

    const command = commands[currentCommand];

    for (let i = 0; i <= command.command.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 40));
      setOutput(
        `$ ${command.command.substring(0, i)}${i < command.command.length ? "█" : ""}`
      );
    }

    await new Promise(resolve => setTimeout(resolve, 400));
    setOutput(`$ ${command.command}\n${command.output}`);
    setIsRunning(false);

    setTimeout(() => {
      setCurrentCommand(prev => (prev + 1) % commands.length);
    }, 2500);
  }, [currentCommand, isRunning]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isRunning) {
        runCommand();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentCommand, isRunning, runCommand]);

  return (
    <section className="section-padding">
      <div className="container-wide">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <span className="overline mb-4 block">{t("overline")}</span>
            <h2 className="text-[var(--primary)]">{t("title")}</h2>
          </div>
          <p className="text-[var(--secondary)] max-w-md text-lg">
            {t("description")}
          </p>
        </div>

        {/* Terminal */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--card-background)] overflow-hidden shadow-[var(--shadow-md)]">
            {/* Terminal header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[var(--highlight)] border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]/80" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]/80" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]/80" />
                </div>
                <div className="flex items-center gap-2 text-[var(--secondary)] text-sm font-mono">
                  <Terminal className="w-4 h-4" />
                  gabriel@dev ~ bash
                </div>
              </div>
              <button
                onClick={runCommand}
                disabled={isRunning}
                className="p-1.5 text-[var(--secondary)] hover:text-[var(--primary)] transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>

            {/* Terminal content */}
            <div className="p-6 font-mono text-sm bg-[var(--background)]">
              <pre className="text-[var(--accent-purple)] leading-relaxed whitespace-pre-wrap min-h-[100px]">
                {output || <span className="typing-cursor text-[var(--secondary)]">$ Ready...</span>}
              </pre>
            </div>
          </div>
        </div>

        {/* Tools grid */}
        <div className="grid md:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto">
          <div className="space-y-4">
            <h4 className="text-[var(--primary)] font-medium">{t("development")}</h4>
            <ul className="space-y-2">
              {devItems.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[var(--secondary)] text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-purple)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[var(--primary)] font-medium">{t("deployment")}</h4>
            <ul className="space-y-2">
              {deployItems.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[var(--secondary)] text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-purple)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
