
import { useState } from "react";
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
import logoWhite from "./../../public/icons/logo-white.png";

const formSchema = z.object({
  user_name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  user_email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  user_mobile: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 md:p-8">
      <div className="w-full max-w-md space-y-6 md:space-y-8 p-6 md:p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
        <div className="flex justify-center">
          <img src={logoWhite} alt="Logo" className="w-48 md:w-64 h-auto mb-4 md:mb-6" />
        </div>
        
        <div className="text-center space-y-2">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Create an account
          </h1>
          <p className="text-sm text-gray-400">
            Enter your details to get started with SalesAdvisor
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
            <FormField
              control={form.control}
              name="user_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 text-sm md:text-base">Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="John Doe" 
                      {...field}
                      className="bg-gray-700 text-white border-gray-600 focus-visible:ring-[#A259FF] h-10 md:h-12 text-sm md:text-base" 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs md:text-sm" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="user_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 text-sm md:text-base">Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="john@example.com" 
                      {...field} 
                      className="bg-gray-700 text-white border-gray-600 focus-visible:ring-[#A259FF] h-10 md:h-12 text-sm md:text-base"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs md:text-sm" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="user_mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 text-sm md:text-base">Phone Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="123-456-7890" 
                      {...field} 
                      className="bg-gray-700 text-white border-gray-600 focus-visible:ring-[#A259FF] h-10 md:h-12 text-sm md:text-base"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs md:text-sm" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 text-sm md:text-base">Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      {...field} 
                      className="bg-gray-700 text-white border-gray-600 focus-visible:ring-[#A259FF] h-10 md:h-12 text-sm md:text-base"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs md:text-sm" />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-[#A259FF] hover:bg-[#A259FF]/90 h-10 md:h-12 text-sm md:text-base font-medium min-h-[44px]" 
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </Form>
        
        <div className="text-center mt-4">
          <p className="text-xs md:text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/signin" className="text-[#A259FF] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
