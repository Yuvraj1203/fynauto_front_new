"use client";

import {
  ButtonType,
  CustomButton,
  CustomInput,
  CustomSelect,
  InputTypes,
} from "@/components/custom";
import { Screen, ScreenHeader } from "@/components/template";
import { UserRoleEnum } from "@/services/models/loginModel/loginModel";
import { CustomColor } from "@/services/types";
import { useTranslations } from "next-intl";
import { useState } from "react";

const roleOptions = [
  { key: UserRoleEnum.Admin, label: "Admin" },
  { key: UserRoleEnum.Dev, label: "Developer" },
  { key: UserRoleEnum.User, label: "User" },
];

type FormData = {
  name: string;
  email: string;
  password: string;
  role: UserRoleEnum;
};

const CreateUserPage = () => {
  const t = useTranslations();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: UserRoleEnum.User,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.role) newErrors.role = "Role is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Dummy API call simulation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Create user:", formData);
      alert("User created successfully! (Dummy response)");
      // Reset form on success
      setFormData({
        name: "",
        email: "",
        password: "",
        role: UserRoleEnum.User,
      });
    } catch (error) {
      alert("Error creating user");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: keyof FormData, value: string | UserRoleEnum) => {
    setFormData({ ...formData, [key]: value });
    if (errors[key]) setErrors({ ...errors, [key]: "" });
  };

  return (
    <Screen
      className="bg-surface flex flex-col gap-4 pt-4 sm:pt-6 overflow-auto scrollbar-hide"
      defaultPadding={false}
    >
      <ScreenHeader
        title={t("CreateUser") || "Create User"}
        subTitle="Add a new user account"
        className="bg-surface px-4 sm:px-6 pb-2 sm:pb-3"
      />
      <form
        onSubmit={handleSubmit}
        className="grow flex flex-col gap-4 relative "
      >
        <div className="grow flex flex-col gap-4 px-4 sm:px-6">
          <CustomInput
            label="Name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            description={errors.name}
            isRequired
          />
          <CustomInput
            label="Email"
            type={InputTypes.email}
            placeholder="Enter email address"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            description={errors.email}
            isRequired
          />
          <CustomInput
            label="Password"
            type={InputTypes.password}
            placeholder="Enter password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            description={errors.password}
            isRequired
          />
          <CustomSelect
            data={roleOptions}
            itemKey={"key"}
            itemLabel={"label"}
            label={"Select Role"}
            value={formData.role}
            placeholder="Select user role"
            isRequired
            onChange={(value) => {
              handleChange(
                "role",
                (value as UserRoleEnum) || UserRoleEnum.User,
              );
            }}
          />
        </div>

        <div
          className={
            "sticky bottom-0 left-0 right-0 px-4 sm:px-6 py-2 sm:py-3 w-full bg-surface z-50 border-t-1 border-default-300"
          }
        >
          <CustomButton
            type={ButtonType.submit}
            color={CustomColor.primary}
            className=" "
            loading={loading}
            isDisabled={loading}
            fullWidth={true}
          >
            Create User
          </CustomButton>
        </div>
      </form>
    </Screen>
  );
};

export default CreateUserPage;
