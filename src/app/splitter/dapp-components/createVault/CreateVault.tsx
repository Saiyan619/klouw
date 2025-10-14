import { VaultIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import CreateVaultModal from "./component/CreateVaultModal";
import { useEffect } from "react";
import { useGetAllVaults } from "@/app/hooks/get-vault-hook";
import UserVaults from "../userVaults/UserVaults";


const CreateVault = () => {
const { data } = useGetAllVaults();
  useEffect(() => {
    console.log(data)
  }, []);
    return (
        <div className="p-4">
            <div>
                <h1 className="text-3xl font-bold">Your Vault</h1>
          <p className="text-gray-400 text-sm">Manage your token distribution vaults</p>
                    <CreateVaultModal />

            </div>
        {data && data.length > 0 ? (
          <UserVaults />
      ): <Empty className="border-4 mt-5">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <VaultIcon />
        </EmptyMedia>
        <EmptyTitle>No Vaults Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any Vaults yet. Get started by creating
          your first Vault.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <CreateVaultModal />
        </div>
      </EmptyContent>
      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
      </Button>
    </Empty>}
   </div>
    );
  }



export default CreateVault;
