import { Image, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "../../hooks/WarmUpBrowser";
import * as Linking from "expo-linking";
import { useNavigation } from "@react-navigation/native";

WebBrowser.maybeCompleteAuthSession();
export default function LoginScreen() {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const onPress = async () => {
    try {
      const redirectUrl = Linking.createURL("/dashboard", {
        scheme: "digitalmandi",
      });
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl,
      });

      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  };
  return (
    <View>
      <Image
        source={require("../../assets/images/mandi.jpg")}
        className="w-full h-[400px] object-cover"
      />
      <View className="p-5 rounded-t-3xl shadow-lg border-1 z-40 ">
        <Text className="text-[27px] font-bold ">Community Marketplace</Text>
        <Text className="text-[15px] text-slate-500 mt-6">
          Buy and Sell items at the comfort of your home and start making money
        </Text>
        <TouchableOpacity
          onPress={onPress}
          className="p-4 bg-blue-500 rounded-full mt-20"
        >
          <Text className="text-white text-center text-[16px]">
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
// "linking": {
//       "enabled": true,
//       "config": {
//         "screens": {
//           "Home": "/",
//           "Dashboard": "/dashboard"
//         }
//       }
//     }
