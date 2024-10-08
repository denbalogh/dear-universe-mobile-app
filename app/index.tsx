import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
} from "react-native";
import { Realm, RealmProvider, useRealm, useQuery } from "@realm/react";
import { ObjectSchema } from "realm";

const generate = (description: string) => ({
  _id: new Realm.BSON.ObjectId(),
  description,
  createdAt: new Date(),
});

export class Task extends Realm.Object {
  _id: Realm.BSON.ObjectId = new Realm.BSON.ObjectId();
  description!: string;
  isComplete: boolean = false;
  createdAt: Date = new Date();
  userId!: string;

  static schema: ObjectSchema = {
    name: "Task",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      description: "string",
      isComplete: { type: "bool", default: false },
      createdAt: "date",
    },
  };
}

export default function AppWrapper() {
  return (
    <RealmProvider schema={[Task]}>
      <TaskApp />
    </RealmProvider>
  );
}

function TaskApp() {
  const realm = useRealm();
  const tasks = useQuery(Task);
  const [newDescription, setNewDescription] = useState("");

  return (
    <SafeAreaView>
      <View
        style={{ flexDirection: "row", justifyContent: "center", margin: 10 }}
      >
        <TextInput
          value={newDescription}
          placeholder="Enter new task description"
          onChangeText={setNewDescription}
        />
        <Pressable
          onPress={() => {
            realm.write(() => {
              realm.create("Task", generate(newDescription));
            });
            setNewDescription("");
          }}
        >
          <Text>➕</Text>
        </Pressable>
      </View>
      <FlatList
        data={tasks.sorted("createdAt")}
        keyExtractor={(item) => item._id.toHexString()}
        renderItem={({ item }) => {
          return (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                margin: 10,
              }}
            >
              <Pressable
                onPress={() =>
                  realm.write(() => {
                    item.isComplete = !item.isComplete;
                  })
                }
              >
                <Text>{item.isComplete ? "✅" : "☑️"}</Text>
              </Pressable>
              <Text style={{ paddingHorizontal: 10 }}>{item.description}</Text>
              <Pressable
                onPress={() => {
                  realm.write(() => {
                    realm.delete(item);
                  });
                }}
              >
                <Text>{"🗑️"}</Text>
              </Pressable>
            </View>
          );
        }}
      ></FlatList>
    </SafeAreaView>
  );
}
