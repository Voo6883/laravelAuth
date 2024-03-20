import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';

export default class Example extends Component {
    constructor() {
        super()
        this.state = {
            posts: [],
            editModal: false, // State variable for edit modal
            createModal: false, // State variable for create modal
            editPostData: {
                id: '',
                title: '',
                content: ''
            },
            newPostData: {
                user_id: 1,
                title: '',
                content: ''
            }
        }
        this.toggleEditModal = this.toggleEditModal.bind(this);
        this.toggleCreateModal = this.toggleCreateModal.bind(this);
        this.handleEditPost = this.handleEditPost.bind(this);
        this.handleCreatePost = this.handleCreatePost.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.deletePost = this.deletePost.bind(this);
    }

    componentDidMount() {
        this.loadPosts();
    }

    loadPosts() {
        axios.get('http://localhost:8001/api/posts')
            .then(response => {
                this.setState({
                    posts: response.data
                });
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });
    }

    toggleEditModal() {
        this.setState(prevState => ({
            editModal: !prevState.editModal
        }));
    }

    toggleCreateModal() {
        this.setState(prevState => ({
            createModal: !prevState.createModal
        }));
    }

    handleEditPost(postId) {
        axios.put(`http://localhost:8001/api/post/${postId}`, this.state.editPostData)
            .then(response => {
                console.log('Post edited successfully');
                this.loadPosts();
                this.toggleEditModal();
            })
            .catch(error => {
                console.error('Error editing post:', error);
            });
    }

    deletePost(postId) {
        axios.delete(`http://localhost:8001/api/post/${postId}`)
            .then(response => {
                console.log('Post deleted successfully');
                this.loadPosts(); // Refresh posts after deletion
            })
            .catch(error => {
                console.error('Error deleting post:', error);
            });
    }

    handleCreatePost() {
        axios.post(`http://localhost:8001/api/post`, this.state.newPostData)
            .then(response => {
                console.log('Post created successfully');
                this.loadPosts();
                this.toggleCreateModal();
            })
            .catch(error => {
                console.error('Error creating post:', error);
            });
    }

    handleChange(event, type) {
        const { name, value } = event.target;
        if (type === 'new') {
            this.setState(prevState => ({
                newPostData: {
                    ...prevState.newPostData,
                    [name]: value
                }
            }));
        } else {
            this.setState(prevState => ({
                editPostData: {
                    ...prevState.editPostData,
                    [name]: value
                }
            }));
        }
    }

    render() {
        let posts = this.state.posts.map(post => (
            <tr key={post.id}>
                <td>{post.id}</td>
                <td>{post.title}</td>
                <td>{post.content}</td>
                <td>
                    <Button color="success" size="sm" className="mr-2" onClick={() => {
                        this.setState({ editPostData: { id: post.id, title: post.title, content: post.content } });
                        this.toggleEditModal();
                    }}> Edit </Button>
                    <Button color="danger" size="sm" className="mr-2" onClick={() => this.deletePost(post.id)}> Delete </Button>
                </td>
            </tr>
        ));

        return (
            <div className="container">
                <div style={{ marginBottom: 20 }}>
                    <Button color='primary' onClick={this.toggleCreateModal}>Create Post</Button>
                </div>
                <Table striped bordered responsive style={{ padding: '100px' }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Content</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts}
                    </tbody>
                </Table>
                {/* Edit Post Modal */}
                <Modal isOpen={this.state.editModal} toggle={this.toggleEditModal} className="modal-dialog modal-dialog-centered">
                    <ModalHeader toggle={this.toggleEditModal}>Edit Post</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label for="title">Title</Label>
                                <Input type="text" name="title" id="title" value={this.state.editPostData.title} onChange={this.handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="content">Content</Label>
                                <Input type="textarea" name="content" id="content" value={this.state.editPostData.content} onChange={this.handleChange} />
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.handleEditPost(this.state.editPostData.id)}>Save</Button>
                        <Button color="secondary" onClick={this.toggleEditModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                {/* Create Post Modal */}
                <Modal isOpen={this.state.createModal} toggle={this.toggleCreateModal} className="modal-dialog modal-dialog-centered">
                    <ModalHeader toggle={this.toggleCreateModal}>Create Post</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label for="title">Title</Label>
                                <Input type="text" name="title" id="title" value={this.state.newPostData.title} onChange={(e) => this.handleChange(e, 'new')} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="content">Content</Label>
                                <Input type="textarea" name="content" id="content" value={this.state.newPostData.content} onChange={(e) => this.handleChange(e, 'new')} />
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleCreatePost}>Save</Button>
                        <Button color="secondary" onClick={this.toggleCreateModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

if (document.getElementById('example')) {
    ReactDOM.render(<Example />, document.getElementById('example'));
}
