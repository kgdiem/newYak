import React, {Component} from 'react';
import {SafeAreaView} from 'react-native';

import {AddComment} from './AddComment';
import Loading from '../common/Loading';

import { postService } from '../../services';

import defaultStyles from '../../styles';
import { defaultNavigationOptions } from '../../constants';
import NavButton from '../common/NavButton';

export class AddCommentContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            comment: '',
            loading: false
        }

        this.props.navigation.setParams({saveButton: this.getSaveButton()})
    }

    static navigationOptions = props => ({
        ...defaultNavigationOptions,
        headerRight: props.navigation.getParam('saveButton')
    })

    getSaveButton = () => (<NavButton onClick={this.addComment} icon='save'/>)

    addComment = async () => {
        this.setState({loading: true});

        try{
            const post = this.props.navigation.getParam('post');

            await postService.addComment(post.id, this.state.comment);

            this.props.navigation.goBack();
        } catch(e) {
            alert('Unable to save your comment. Please try again.');
        } finally {
            this.setState({loading: false});
        }
    }

    onCommentChange = comment => this.setState({comment})

    render() {
        const post = this.props.navigation.getParam('post');
        const {comment, loading} = this.state;

        return (
            <SafeAreaView style={defaultStyles.container}>
                <Loading loading={loading}/>
                {!loading && 
                    <AddComment
                        onCommentChange={this.onCommentChange}
                        postAuthor={post.author_id}
                        postBody={post.body}
                        comment={comment}
                    />
                }
            </SafeAreaView>
        )
    }
}