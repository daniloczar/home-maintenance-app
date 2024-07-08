import { StyleSheet, Text, View, ScrollView } from "react-native";
import React from 'react'
import Jobs from './Jobs'

export default function JobPage() {
  return (
    <View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Jobs/>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({})