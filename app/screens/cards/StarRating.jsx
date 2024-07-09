import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FontAwesome from "react-native-vector-icons/FontAwesome";


export default function StarRating({item}) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    let starName = i <= item.review_rating ? "star" : "star-o";
    stars.push(
      <FontAwesome
        key={i}
        name={starName}
        size={13}
        color={i <= item.review_rating ? "#edd902" : "black"}
      />
    );
  }
  return (
    <View style={{ display: "flex", flexDirection: "row", gap: 3 }}>
      {stars}
    </View>
  );
}

const styles = StyleSheet.create({})