import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import {FETCH_POSTS_QUERY} from '../util/graphql'
import { Grid, Transition } from 'semantic-ui-react'
import PostForm from '../components/PostForm'

import PostCard from '../components/PostCard'
import { AuthContext } from '../context/auth'


function Home() {
    const { loading, data } = useQuery(FETCH_POSTS_QUERY)
    const { user } = useContext(AuthContext)

    return (
        <Grid columns={1}>
            <Grid.Row className="page-title">
                <h1>Recent Stories</h1>
            </Grid.Row>
            <Grid.Row>
                {user && (
                    <Grid.Column>
                        <PostForm />
                    </Grid.Column>
                )}
                {loading ? (
                    <h1>Loading posts...</h1>
                ) : (
                    <Transition.Group>
                        {data.getPosts && data.getPosts.map(post => (
                        <Grid.Column key={post.id}>
                            <PostCard post={post} />
                        </Grid.Column>
                    ))}
                    </Transition.Group>
                )}
            </Grid.Row>
        </Grid>
    )
}



export default Home
