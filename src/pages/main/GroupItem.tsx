import { GroupInfoWithPresidentUuid } from "src/types/interfaces";

import ArrowRight from "@/assets/icons/arrow-right.svg?react";
import { Crown } from "iconoir-react";
import Settings from "@/assets/icons/settings.svg?react";
import GroupProfileDefault from "@/assets/icons/group-profile-default.webp";
import Card from "@/components/card/Card";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { getUserRole } from "@/apis/group";
import useAuth from "@/hooks/useAuth";
import { cn } from "@/utils/clsx";

const GroupItem = ({
  groupParams,
}: {
  groupParams: {
    group: GroupInfoWithPresidentUuid;
  };
}) => {
  const group = groupParams.group;
  const { userInfo } = useAuth();

  const { data: userRole } = useSWR(
    ["userRole", group.uuid || ""],
    ([_, uuid]) => getUserRole(uuid),
  );

  if (!userRole) return <></>;

  const isAdmin = userRole.name === "admin";
  const isManager = userRole.name === "manager";
  const isPresident = userInfo?.uuid === group.presidentUuid;

  const getCrownColor = () => {
    if (isPresident) return "text-yellow-500";
    if (isAdmin) return "text-slate-400";
    if (isManager) return "text-amber-700";
    return null;
  };

  const crownColor = getCrownColor();

  return (
    <Card>
      <a href={`/group/${group.uuid}`} className={"flex items-center"}>
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={group.profileImageUrl || GroupProfileDefault}
            alt="group-default-profile"
            className="w-full h-full object-cover"
          />
        </div>

        <p className="flex items-center gap-2 ml-[15px] mr-[5px] text-lg font-semibold text-dark dark:text-d_white">
          {group.name}
          {crownColor && <Crown className={cn(crownColor)} />}
        </p>

        <div className="flex-grow" />

        {isAdmin && (
          <Link to={`/manage/${group.uuid}/groupinfo`}>
            <Settings className="fill-greyDark mr-2" />
          </Link>
        )}

        <ArrowRight className="h-[30px] stroke-dark dark:stroke-d_white" />
      </a>
    </Card>
  );
};

export default GroupItem;
