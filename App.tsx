import { StyleSheet, Platform, View, BackHandler } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import WebView from "react-native-webview";
import { useEffect, useRef, useState } from "react";

function WebShell() {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  // 상태바/시스템 색상 설정
  useEffect(() => {
    SystemUI.setBackgroundColorAsync("#ffffff");
  }, []);

  // Android 물리적 뒤로가기 버튼 제어
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (canGoBack && webViewRef.current) {
          webViewRef.current.goBack(); // ← 웹의 이전 페이지로 이동
          return true; // 기본 동작(앱 종료) 방지
        }
        return false; // 더 이상 이동할 페이지가 없으면 앱 종료 허용
      }
    );

    return () => backHandler.remove();
  }, [canGoBack]);

  const isWeb = Platform.OS === "web";

  return (
    <View style={styles.container}>
      {/* 상단 안전 영역 */}
      <View style={{ paddingTop: Constants.statusBarHeight }}>
        <StatusBar style="dark" backgroundColor="#ffffff" translucent={false} />
      </View>

      {/* WebView */}
      <View style={{ flex: 1 }}>
        {isWeb ? (
          <iframe
            src="https://www.nutritioncorp.kr/"
            style={{ border: "none", width: "100%", height: "100%" }}
            title="WebView"
          />
        ) : (
          <WebView
            ref={webViewRef}
            source={{ uri: "https://www.nutritioncorp.kr/" }}
            style={styles.webview}
            setSupportMultipleWindows={false}
            allowsBackForwardNavigationGestures
            onNavigationStateChange={(navState) => {
              setCanGoBack(navState.canGoBack);
            }}
          />
        )}
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <WebShell />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  webview: { flex: 1 },
});
