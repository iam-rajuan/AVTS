import React from "react";
import homeFilled from "../assets/home.svg";
import person from "../assets/user-square.svg";
import squaredMenu from "../assets/service.svg";
import view from "../assets/activity.svg";

export const Footer = () => {
  return (
    <div className="w-[400px] h-[77px]">
      <div className="relative w-[402px] h-[79px] -top-px -left-px bg-[#d9d9d9] rounded-[25.51px] border-[0.5px] border-solid border-[#757575]">
        <div className="flex w-[315px] items-start gap-[58.15px] relative top-[13px] left-[42px] bg-[#d9d9d9]">
          <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
            <img
              className="relative w-[29.08px] h-[29.08px]"
              alt="Home filled"
              src={homeFilled}
            />

            <div className="relative w-fit [font-family:'Roboto-Medium',Helvetica] font-medium text-black text-[9.7px] text-center tracking-[0.48px] leading-[normal] whitespace-nowrap">
              Home
            </div>
          </div>

          <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
            <img
              className="relative w-[29.08px] h-[29.08px]"
              alt="Squared menu"
              src={squaredMenu}
            />

            <div className="relative w-fit [font-family:'Roboto-Medium',Helvetica] font-medium text-black text-[9.7px] text-center tracking-[0.48px] leading-[normal] whitespace-nowrap">
              Service
            </div>
          </div>

          <div className="inline-flex flex-col items-start gap-[2.91px] relative flex-[0_0_auto]">
            <img
              className="relative w-[29.08px] h-[29.08px]"
              alt="View"
              src={view}
            />

            <div className="relative w-fit [font-family:'Roboto-Medium',Helvetica] font-medium text-black text-[9.7px] text-center tracking-[0.48px] leading-[normal] whitespace-nowrap">
              Activity
            </div>
          </div>

          <div className="inline-flex flex-col items-center gap-[2.91px] relative flex-[0_0_auto]">
            <img
              className="relative w-[29.08px] h-[29.08px]"
              alt="Person"
              src={person}
            />

            <div className="relative w-fit [font-family:'Roboto-Medium',Helvetica] font-medium text-black text-[9.7px] text-center tracking-[0.48px] leading-[normal] whitespace-nowrap">
              Account
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
