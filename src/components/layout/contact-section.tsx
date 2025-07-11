"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Linkedin, Mail, MessageCircle } from "lucide-react";

export function ContactSection() {
  return (
    <section id="contact" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-3 text-black dark:text-white">
            Get In Touch
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
            Let&apos;s discuss your next project or explore opportunities to
            collaborate.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Contact Methods Grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <a
              href="mailto:gabriel@example.com"
              className="block"
              tabIndex={-1}>
              <Card className="card-shadow card-radius bg-white dark:bg-gray-800 border-0 transition-card hover:shadow-lg cursor-pointer animate-slide-up animate-stagger-1 hover:scale-105 h-full">
                <CardContent className="p-4 text-center">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg w-fit mx-auto mb-3 transition-all duration-300 hover:scale-110">
                    <Mail className="h-5 w-5 text-purple-500" />
                  </div>
                  <h3 className="font-medium text-sm mb-1">Email</h3>
                  <p className="caption">gabrielhalus@gmail.com</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-xs h-7 pointer-events-none opacity-70"
                    tabIndex={-1}
                    aria-hidden="true">
                    Send Email
                  </Button>
                </CardContent>
              </Card>
            </a>

            <a
              href="https://wa.me/789038887?text=Hello%20Gabriel,%20I%20would%20like%20to%20discuss%20a%20project%20with%20you."
              target="_blank"
              rel="noopener noreferrer"
              className="block"
              tabIndex={-1}>
              <Card className="card-shadow card-radius bg-white dark:bg-gray-800 border-0 transition-card hover:shadow-lg cursor-pointer animate-slide-up animate-stagger-3 hover:scale-105 h-full">
                <CardContent className="p-4 text-center">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg w-fit mx-auto mb-3 transition-all duration-300 hover:scale-110">
                    <MessageCircle className="h-5 w-5 text-purple-500" />
                  </div>
                  <h3 className="font-medium text-sm mb-1">Quick Chat</h3>
                  <p className="caption">Available 9-5 CET</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-xs h-7 pointer-events-none opacity-70"
                    tabIndex={-1}
                    aria-hidden="true">
                    Start Chat
                  </Button>
                </CardContent>
              </Card>
            </a>
          </div>

          {/* Social Links */}
          <div className="mt-8 text-center">
            <p className="caption mb-4">Or connect with me on</p>
            <div className="flex justify-center gap-3">
              <Button
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full px-6 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                asChild>
                <a
                  href="https://github.com/gabrielhalus"
                  target="_blank"
                  rel="noopener noreferrer">
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor">
                    <title>GitHub</title>
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
