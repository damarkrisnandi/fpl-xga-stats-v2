"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Trash } from "lucide-react";
import { getManagerData } from "@/services/index";

const AppInputMyTeam = (props: any) => {
  const [teamId, setTeamId] = useState<any>(null);
  const [manager, setManager] = useState<any>(null);
  useEffect(() => {
    if (!teamId && !manager && localStorage.getItem("manager_id_stored")) {
      setTeamId(localStorage.getItem("manager_id_stored"));
      setTimeout(() => {
        getManagerData(localStorage.getItem("manager_id_stored") || 0).then((
          value: any,
        ) => setManager(value));
      }, 300);
    }
  }, [teamId, manager]);
  const handleOnChange = (event: any) => {
    setTeamId(event.target.value);
  };

  const handleOnSearch = (event: any) => {
    getManagerData(teamId).then((value: any) => setManager(value));
  };

  const handleOnFind = (event: any) => {
    props.onFindMyTeam(event.target.value);
  };

  const handleOnRemoveStoredId = (event: any) => {
    localStorage.removeItem("manager_id_stored");
    setTeamId(null);
    setManager(null);
    props.onRemoveMyTeam(true);
  };
  return (
    <div className="w-full">
      <div className="flex h-12 space-x-2">
        <Input
          type="text"
          placeholder="Input My Team"
          onChange={handleOnChange}
          value={teamId || ""}
        />
        <Button
          className=""
          disabled={!teamId || teamId.length == 0}
          onClick={handleOnSearch}
        >
          <Search />
        </Button>
      </div>
      {manager && (
        <div
          className={`w-full h-28 md:w-full md:h-48 p-3 md:p-6 flex flex-col justify-center items-start bg-slate-200`}
        >
          <p className="text-xs md:text-sm">ID: {manager.id}</p>
          <p className="text-sm md:text-xl font-semibold">{manager.name}</p>
          <p className="text-xs md:text-sm">
            {manager.player_first_name} {manager.player_last_name}
          </p>
          <div className="w-full flex justify-end space-x-1">
            <Button
              className="flex space-x-2 text-xs md:text-sm"
              disabled={localStorage.getItem("manager_id_stored") !== null}
              value={manager.id}
              onClick={handleOnFind}
            >
              Find My Team
            </Button>
            {localStorage.getItem("manager_id_stored") &&
              (
                <Button
                  className="flex space-x-2 text-xs md:text-sm"
                  variant={"destructive"}
                  value={"manager_id_stored"}
                  onClick={handleOnRemoveStoredId}
                >
                  <Trash />
                </Button>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppInputMyTeam;
