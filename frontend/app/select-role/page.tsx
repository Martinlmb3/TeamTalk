"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { selectRoleSchema, type SelectRoleFormData } from "@/schemas/role.schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Users, Trophy } from "lucide-react";

export default function SelectRolePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SelectRoleFormData>({
    resolver: zodResolver(selectRoleSchema),
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: SelectRoleFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Send cookies with request
        body: JSON.stringify({ role: data.role }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update role");
      }

      const result = await response.json();

      toast({
        title: "Success",
        description: result.message || "Role updated successfully",
      });

      // Redirect to dashboard after successful role selection
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update role",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Choose Your Role</CardTitle>
          <CardDescription className="text-lg">
            Select whether you want to join as a player or a coach
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <RadioGroup
              onValueChange={(value) => setValue("role", value as "Player" | "Coach")}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Player Option */}
              <div>
                <RadioGroupItem
                  value="Player"
                  id="player"
                  className="peer sr-only"
                  {...register("role")}
                />
                <Label
                  htmlFor="player"
                  className={`flex flex-col items-center justify-center rounded-lg border-2 p-6 cursor-pointer transition-all ${
                    selectedRole === "Player"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                  }`}
                >
                  <Users className={`w-16 h-16 mb-4 ${
                    selectedRole === "Player" ? "text-primary" : "text-gray-400"
                  }`} />
                  <span className="text-xl font-semibold mb-2">Player</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Join teams, participate in matches, and track your performance
                  </span>
                </Label>
              </div>

              {/* Coach Option */}
              <div>
                <RadioGroupItem
                  value="Coach"
                  id="coach"
                  className="peer sr-only"
                  {...register("role")}
                />
                <Label
                  htmlFor="coach"
                  className={`flex flex-col items-center justify-center rounded-lg border-2 p-6 cursor-pointer transition-all ${
                    selectedRole === "Coach"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                  }`}
                >
                  <Trophy className={`w-16 h-16 mb-4 ${
                    selectedRole === "Coach" ? "text-primary" : "text-gray-400"
                  }`} />
                  <span className="text-xl font-semibold mb-2">Coach</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Create teams, manage players, organize training sessions
                  </span>
                </Label>
              </div>
            </RadioGroup>

            {errors.role && (
              <p className="text-sm text-red-500 text-center">{errors.role.message}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading || !selectedRole}
            >
              {isLoading ? "Updating..." : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
