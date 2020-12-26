import React, { useContext } from 'react'
import moment from 'moment'
import { Button, Icon, Popup } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/auth'
import LikeButton from './LikeButton'
import DeleteButton from './DeleteButton'

function PostCard({ post: { body, createdAt, id, username, likeCount, 
    commentCount, likes }}){

    const { user } = useContext(AuthContext)


    return (  
        <div class="ui raised card fluid post-class">
            <div class="content">
                <div class="header">
                <img class="ui avatar image" src="https://semantic-ui.com/images/avatar/small/matt.jpg" alt=""></img>
                <span style={{ marginLeft: 10}}>{username}</span>
                <span style={{ fontSize: 12, color: "gray", float: "right"  }}>{  moment(createdAt).fromNow(true) }</span></div>
                <div class="description">
                {body}
                </div>
                
            </div>
            <div class="extra content custom">

                
                <LikeButton user={user} post={{id, likes, likeCount }} />
                
                <div class="ui labeled button" tabIndex="0">
                    <div style={{ float: 'right'}}>
                        <Popup
                            inverted
                            content="add comments"
                            trigger={<Button  className="custom-button" icon as={Link} to={`/post/${id}`}>
                            <Icon name='comment blue' />
                        </Button>} />
                        
                        {commentCount}
                    </div>
                </div>

                { user && user.username === username && <DeleteButton postId={id} /> }
            </div>

    </div>
    )
}
                



export default PostCard