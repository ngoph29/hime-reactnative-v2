import { StyleSheet, ScrollView, FlatList, Text, TouchableOpacity, View } from "react-native";
import { useState, useEffect } from "react";
import { SearchBar } from "react-native-elements";
import { FAB } from "react-native-paper";

import HorizontalPost from "../components/molecules/horizontalPost";

import { getCauChuyen, getBaiHoc, doSearch } from "../api/services";

export default function HomeScreen({ navigation }) {
  const [story, setStory] = useState([]);
  const [lesson, setLesson] = useState([]);
  const [search, setSeach] = useState("");

  useEffect(() => {
    getCauChuyen().then((res) => {
      console.log("getCauChuyen");
      setStory(res);
    });

    getBaiHoc().then((res) => {
      console.log("getBaiHoc");
      // setLesson(res.slice(0, 3));
      setLesson(res);
    });
  }, []);

  updateSearch = (search) => {
    setSeach(search);
  };

  onSummitEditing = async (event) => {
    const keyword = event.nativeEvent.text.toUpperCase();
    console.log("searching...", keyword);
    const response = await doSearch(keyword);
    navigation.navigate("Library", { data: response });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <SearchBar
          style={styles.searchBar}
          placeholder="Tìm kiếm..."
          onChangeText={updateSearch}
          onSubmitEditing={onSummitEditing}
          value={search}
        />
        <Text style={styles.session}>Danh sách câu chuyện</Text>
        <FlatList
          horizontal={true}
          data={story}
          contentContainerStyle={styles.contentContainer}
          // ListFooterComponent={btnLoadMore}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate("Content", { html: item.html })}>
              <HorizontalPost
                id={item.id}
                title={item.title}
                shorttext={item.shorttext}
                avatar={item.avatar}
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
        <Text style={styles.session}>Danh sách bài học</Text>
        <FlatList
          horizontal={true}
          data={lesson}
          contentContainerStyle={styles.contentContainer}
          // ListFooterComponent={btnLoadMore}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate("Content", { html: item.html })}>
              <HorizontalPost
                id={item.id}
                title={item.title}
                shorttext={item.shorttext}
                avatar={item.avatar}
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      </ScrollView>
      <FAB
        style={styles.fab_cam}
        icon="camera"
        color="coral"
        onPress={() => navigation.navigate("Camera")}
      ></FAB>
      <FAB
        style={styles.fab_AR}
        icon="camera"
        color="black"
        onPress={() => navigation.navigate("AR")}
      ></FAB>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    padding: 40,
  },
  list: {
    marginTop: 20,
  },
  session: {
    margin: 10,
    fontSize: 25,
    color: "black",
    fontWeight: "bold",
    flexWrap: "wrap",
  },
  contentContainer: {
    alignItems: "center",
  },
  fab_cam: {
    position: "absolute",
    bottom: 0,
    alignSelf: "flex-end",
    borderRadius: 100,
    backgroundColor: "coral",
    margin: 16,
    right: 0,
  },
  fab_AR: {
    position: "absolute",
    bottom: 100,
    alignSelf: "flex-end",
    borderRadius: 100,
    backgroundColor: "black",
    margin: 16,
    right: 0,
  },
});
