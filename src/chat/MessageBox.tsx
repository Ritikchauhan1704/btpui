import { Message } from "./types";
import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
// import {ChatMessageSkeleton} from '../skeletons';

export default function MessageBox({
  message,
  onShowSidebar,
}: {
  message: Message;
  onShowSidebar: (message: Message) => void;
}) {
  //trucate message if length > 1000 character
  const truncatedMessage =
    message.content?.length > 1000
      ? message.content.slice(0, 200) + "..."
      : message.content;

  const handleShowMoreClick = () => {
    onShowSidebar(message);
  };

  return (
    <div className="relative w-full">
      {/* user message */}
      {message.role === "user" && (
        <div className="flex text-end w-full justify-end items-start my-4">
          <div className="max-w-[50%]  h-max font-outfit  text-sm bg-white px-5 py-3 rounded-2xl mr-2 text-start">
            <p>
              <span className="font-bold">{message.bot} </span>
              {message.content}
            </p>
          </div>
          <div className="rounded-full flex justify-center items-center bg-zelo-blue-gradient text-xs font-light text-white w-6 h-6 ">
            R
          </div>
        </div>
      )}
      {/* zelo response */}
      {message.role === "zelo" && (
        <div className="flex flex-col text-start w-full items-start">
          <div className="flex w-full">
            <div className="w-6 h-6 mr-2"></div>
            <div className="w-full h-max font-outfit text-sm">
              {/* {message.content === '' ? (
                <div>Loading...</div>
              ) : (
                <> */}
              <Markdown>{truncatedMessage}</Markdown>
              {/* <Markdown>{message.content}</Markdown> */}
              {/* </>
              )} */}
            </div>
          </div>
          {message.content?.length > 200 && (
            <div
              onClick={handleShowMoreClick}
              className={`${
                message.content.length < 200 ? "invisible" : ""
              } flex gap-2 cursor-pointer border-2 rounded-lg px-2 py-1 ml-8 mt-2`}
            >
              <span className="font-normal text-xs text-[#2060AA]">
                Summary of document
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
