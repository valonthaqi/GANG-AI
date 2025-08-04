"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const [fullName, setFullName] = useState("");
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  type Profile = {
    full_name: string | null;
    nickname: string | null;
    gender: string | null;
    avatar_url: string | null;
  };

  const [originalData, setOriginalData] = useState<Profile | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session?.user) {
        console.error("No session found:", error);
        return;
      }

      const uid = session.user.id;
      setUserId(uid);
      setEmail(session.user.email || "");

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .maybeSingle();

        if (profileError) {
          console.error("Failed to load profile:", profileError);
        }

        setFullName(data?.full_name || "");
        setNickname(data?.nickname || "");
        setGender(data?.gender || "");
        setAvatarUrl(data?.avatar_url || "");

        setOriginalData({
          full_name: data?.full_name || "",
          nickname: data?.nickname || "",
          gender: data?.gender || "",
          avatar_url: data?.avatar_url || "",
        });        

      setInitialLoading(false);
    };

    fetchSession();
  }, []);

  useEffect(() => {
    if (!originalData) return;
    const changed =
      fullName !== originalData.full_name ||
      nickname !== originalData.nickname ||
      gender !== originalData.gender ||
      imageFile !== null;
    setHasChanges(changed);
  }, [fullName, nickname, gender, avatarUrl, imageFile, originalData]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!userId || !imageFile) return null;

    const fileExt = imageFile.name.split(".").pop();
    const filePath = `avatars/${userId}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, imageFile, { upsert: true });

    if (uploadError) {
      console.error("Upload failed:", uploadError.message);
      return null;
    }

    const publicUrl = supabase.storage.from("avatars").getPublicUrl(filePath)
      .data.publicUrl;
    return publicUrl;
  };

  const handleSave = async () => {
    if (!userId) return;

    setLoading(true);

    let imageUrl = avatarUrl;
    if (imageFile) {
      const uploadedUrl = await uploadAvatar();
      if (uploadedUrl) imageUrl = uploadedUrl;
    }

    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      full_name: fullName,
      nickname,
      gender,
      avatar_url: imageUrl,
    });

    setLoading(false);

    if (error) {
      console.error("Error saving profile:", error.message);
    } else {
      setAvatarUrl(imageUrl);
      setOriginalData({
        full_name: fullName,
        nickname,
        gender,
        avatar_url: imageUrl,
      });
      setShowSuccess(true);
      setHasChanges(false);
      setImageFile(null);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500 animate-pulse text-lg">
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 relative">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="space-y-4">
        <div>
          <label>Email</label>
          <Input value={email} disabled />
        </div>
        <div>
          <label>Profile Image</label>
          <div className="flex items-center gap-4 cursor-pointer">
            {previewUrl || avatarUrl ? (
              <Image
                src={previewUrl || avatarUrl}
                alt="Avatar"
                width={64}
                height={ 64 }
                priority
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 cursor-pointer" />
            )}
            <input
              type="file"
              className="cursor-pointer"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div>
          <label>Full Name</label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div>
          <label>Nickname</label>
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div>
          <label>Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <Button onClick={handleSave} disabled={loading || !hasChanges}>
          {loading ? "Saving..." : "Save Settings"}
        </Button>

        {showSuccess && (
          <p className="text-green-600 text-sm mt-2 animate-fade-in">
            ✅ Settings saved successfully.
          </p>
        )}
      </div>
    </div>
  );
}
