import React from 'react';

import {FlatList, StyleSheet, View} from 'react-native';
import defaultStyles from '../../styles';

import NoPosts from './NoPosts';
import PostItem from './PostItem';
import separator from '../common/Separator';

export const PostList = ({posts, onPostClick}) => (
    <View style={defaultStyles.container}>
        <FlatList
            data={posts}
            renderItem={post => <PostItem key={post.item.id} post={post.item} onClick={onPostClick}/>}
            ListEmptyComponent={<NoPosts/>}
            ItemSeparatorComponent={separator}
        /> 
    </View>
)

const styles = StyleSheet.create({});