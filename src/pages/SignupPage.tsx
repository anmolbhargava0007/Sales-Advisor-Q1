import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import logo from "./../../public/icons/logo-light1.png";

const formSchema = z.object({
  user_name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  user_email: z.string().email({ message: "Please enter a valid email address." }),
  user_mobile: z.string().min(10, { message: "Please enter a valid phone number." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const SignupPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_name: "",
      user_email: "",
      user_mobile: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const success = await signup({
        user_name: values.user_name,
        user_email: values.user_email,
        user_pwd: values.password,
        user_mobile: values.user_mobile,
        gender: "MALE", // Default value
        is_active: true,
      });

      if (success) {
        navigate("/signin");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-poppins min-h-screen flex items-center justify-center bg-gray-50 p-6 sm:p-10">
      <div className="w-full max-w-xl space-y-8">
      <div className="text-center">
          <img src={logo} alt="logo" className="mx-auto w-80 h-auto" />
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-semibold text-gray-700">
              Create an account
            </h1>
            <p className="text-gray-600 mt-2 text-sm">
              Enter your details to get started with SalesAdvisor
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Grid container with 2 columns, gap between fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="user_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600">Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          className="border border-gray-300 rounded-md p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm mt-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="user_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john@example.com"
                          type="email"
                          {...field}
                          className="border border-gray-300 rounded-md p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm mt-1" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Another row with 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="user_mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600">Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123-456-7890"
                          {...field}
                          className="border border-gray-300 rounded-md p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm mt-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          className="border border-gray-300 rounded-md p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm mt-1" />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-white font-semibold py-3 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link to="/signin" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;