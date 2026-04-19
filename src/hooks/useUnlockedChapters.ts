import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { CHAPTER_MAP } from "@/lib/chapters";

const ALL_CHAPTER_IDS = Object.keys(CHAPTER_MAP);
const FREE_CHAPTER_ID = "cap-1";

export function useUnlockedChapters() {
  const { user, isAdmin } = useAuth();
  const [unlockedChapters, setUnlockedChapters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChapters = async () => {
    if (!user) {
      setUnlockedChapters([]);
      setLoading(false);
      return;
    }

    const isSuperAdminUser = user.email === "jazzherre28@gmail.com";
    if (isAdmin || isSuperAdminUser) {
      setUnlockedChapters(ALL_CHAPTER_IDS);
      setLoading(false);
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("unlocked_chapters")
      .eq("user_id", user.id)
      .single();

    let userChapters: string[] = [];
    if (!profileError && profileData?.unlocked_chapters) {
      userChapters = profileData.unlocked_chapters;
    } else {
      const { data } = await supabase
        .from("user_chapters")
        .select("chapter_id")
        .eq("user_id", user.id);
      userChapters = data?.map((d) => d.chapter_id) ?? [];
    }

    if (!userChapters.includes(FREE_CHAPTER_ID)) {
      userChapters = [...userChapters, FREE_CHAPTER_ID];
    }

    setUnlockedChapters(userChapters);
    setLoading(false);
  };

  useEffect(() => {
    fetchChapters();
  }, [user, isAdmin]);

  return { unlockedChapters, loading, refetch: fetchChapters };
}
