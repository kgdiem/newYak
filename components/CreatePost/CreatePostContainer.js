import React, {Component} from 'react';
import {NavigationActions, StackActions} from 'react-navigation';
import {SafeAreaView} from 'react-native';

import {CreatePost} from './CreatePost';
import Loading from '../common/Loading';

import {postService} from '../../services';

import defaultStyles from '../../styles';
import { defaultNavigationOptions } from '../../constants';
import NavButton from '../common/NavButton';

export class CreatePostContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            body: '',
            loading: false
        }

        this.props.navigation.setParams({saveButton: this.getSaveButton()});

        this.eventSubscriber = postService.eventObserver.subscribe(
            event => {
                if(event.type === postService.eventTypes.createPostComplete)
                    this.navigateHome(event.post);
            },
            error => {
                console.log(error);
                this.setState({loading: false});
                alert('Unable to save your post. Please try again.');
            }
        );
    }

    componentWillUnmount() {
        this.eventSubscriber.unsubscribe();
    }

    static navigationOptions = props => ({
        ...defaultNavigationOptions,
        headerRight: props.navigation.getParam('saveButton')
    })

    getSaveButton = () => (<NavButton icon='check' onClick={this.savePost}/>)

    navigateHome = (post) => {
        const resetAction = StackActions.reset({
            index: 0, 
            actions: [NavigationActions.navigate({ routeName: 'Home' })]
        });

        this.props.navigation.dispatch(resetAction);

        this.props.navigation.navigate('Post', {post});
    }

    savePost = () => {
        this.setState({loading: true});

        postService.createPost({...this.state});
    }

    render() {
        const {body, title, loading} = this.state;

        return (
            <SafeAreaView style={defaultStyles.container}>
                <Loading loading={loading}/>
                {!loading && 
                    <CreatePost 
                        onPostChange={body => this.setState({body})}
                        onTitleChange={title => this.setState({title})}
                        post={body}
                        title={title} 
                    />
                }
            </SafeAreaView>
        )
    }
}