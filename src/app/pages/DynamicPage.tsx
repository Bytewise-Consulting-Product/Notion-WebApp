"use client";

import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { setNewContent } from "@/store/features/UserDataSlice";

import axios from "axios";

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function NotionDynamicPage({
  pid,
}: {
  pid: string | string[] | null;
}) {
  const pageContent = useAppSelector((state) => state.userData.content);
  const dispatch = useAppDispatch();

  const [fetchContent, setFetchContent] = useState<string>("");
  const [changeContent, setChangeContent] = useState<string>("");
  const [selectCid, setSelectCid] = useState<string>("");
  // const [order, setOrder] = useState<number>(0);

  const cachedFn = useCallback(async () => {
    try {
      const response = await axios.post("/api/content-update", {
        pid: pid,
        cid: selectCid,
        data: {
          order: 0,
          type: "text",
          content: changeContent,
        },
      });

      console.log(response);

      toast("Updated");
    } catch (err) {
      console.error(err);
    }
  }, [changeContent, pid, selectCid]);

  // debounce
  useEffect(() => {
    if (changeContent === fetchContent) {
      return;
    }

    const timer = setTimeout(() => {
      cachedFn();
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [changeContent, fetchContent, cachedFn]);

  return (
    <>
      <div className="display flex-col flex gap-3">
        {pageContent.map(
          (content) =>
            content.pid === pid && (
              <Textarea
                key={content.cid || content.order}
                defaultValue={content.content}
                // value={changeContent}
                onClick={() => {
                  setFetchContent(content.content);
                  setChangeContent(content.content);
                  setSelectCid(content.cid);
                }}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setChangeContent(e.target.value);
                }}
              />
            )
        )}
      </div>

      <button
        className="border p-2 hover:bg-gray-100 rounded-2xl"
        onClick={() => {
          // dispatch
          dispatch(
            setNewContent({
              pid: pid as string,
              cid: "",
              content: "",
              order: 1,
              type: "text",
            })
          );

          // send the request
          // setData();
        }}
      >
        Add new content
      </button>
    </>
  );
}
