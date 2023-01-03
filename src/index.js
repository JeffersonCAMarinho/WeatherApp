import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

let url = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${openWeather}`;

const Weather = () => {
  const [forecast, setForecast] = useState(null);

  const [refreshing, setRefreshing] = useState(false);

  const loadForecast = async () => {
    setRefreshing(true);

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status != "granted") {
      Alert.alert("Permission to access location was denied");
    }

    //get the current location
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const response = await fetch(
      `${url}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`
    );

    const data = await response.json(); // convert the response to json
    if (!response.ok) {
      Alert.alert("Error", "Something went wrong");
    } else {
      setForecast(data);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    loadForecast();
  }, []);

  if (!forecast) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const current = forecast.weather[0];

  return (
    <SafeAreaView style={styles.loading}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadForecast}
          />
        }
        style={{ marginTop: 50 }}
      >
        <Text style={styles.title}>Current Weather</Text>
        <Text style={{ alignItems: "center", textAlign: "center" }}>
          your location
        </Text>
        <View style={styles.current}>
          <Image
            style={styles.largeIcon}
            source={{
              uri: `http://openweathermap.org/img/wn/${current.icon}@4x.png`,
            }}
          />
          <Text> {Math.round(forecast.main.temp)}ºC</Text>
        </View>
        <Text style={styles.currentDescription}> {current.description} </Text>
        <View style={styles.extrainfo}>
          <View style={styles.info}>
            <Image
              source={require("../assets/temp.png")}
              style={{
                width: 40,
                height: 40,
                borderRadius: 40 / 2,
                marginLeft: 25,
              }}
            />
            <Text style={styles.text}>{forecast.main.feels_like}ºC</Text>
            <Text style={styles.text}>Feels Like</Text>
          </View>
          <View style={styles.info}>
            <Image
              source={require("../assets/humidity.png")}
              style={{
                width: 40,
                height: 40,
                borderRadius: 40 / 2,
                marginLeft: 25,
              }}
            />
            <Text style={styles.text}>{forecast.main.humidity}ºC</Text>
            <Text style={styles.text}>Humidity</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Weather;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECDBBA",
  },
  title: {
    textAlign: "center",
    fontSize: 36,
    fontWeight: "bold",
    color: "#C84B31",
  },
  current: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
  },
  largeIcon: {
    width: 200,
    height: 150,
  },
  currentTemp: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  currentDescription: {
    width: "100%",
    textAlign: "center",
    fontSize: 40,
    fontWeight: "200",
    marginBottom: 5,
  },
  info: {
    width: Dimensions.get("screen").width / 3,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 15,
    justifyContent: "center",
  },
  extrainfo: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
    padding: 10,
  },
  text: {
    fontSize: 15,
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 24,
    marginVertical: 12,
    marginLeft: 7,
    color: "#C84B31",
    fontWeight: "bold",
  },
});
