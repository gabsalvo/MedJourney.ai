"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SettingsView() {
    const [email, setEmail] = useState("user@example.com");
    const [username, setUsername] = useState("medjourney_user");
    const [notifications, setNotifications] = useState(true);

    return (
        <div className="flex flex-col gap-6 p-6">
            <h1 className="text-2xl font-semibold">Settings</h1>

            {/* Profile Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <Button>Save Changes</Button>
                </CardContent>
            </Card>

            {/* Notifications Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="notifications"
                            checked={notifications}
                            onChange={() => setNotifications(!notifications)}
                            className="w-5 h-5 cursor-pointer"
                        />
                        <Label htmlFor="notifications">Enable notifications</Label>
                    </div>
                    <Button>Update Preferences</Button>
                </CardContent>
            </Card>
        </div>
    );
}
