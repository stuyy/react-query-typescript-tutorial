import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, getPosts, getUsers } from "./utils/api";
import { PostsResponseHttpData, UserResponseHttpData } from "./utils/types";
import { useEffect, useState } from "react";

function App() {
	const USER_ID = 4589;
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");

	const queryClient = useQueryClient();

	const {
		data: usersData,
		error: usersError,
		isLoading: isUsersLoading,
	} = useQuery<UserResponseHttpData[]>({
		queryKey: ["getUsers"],
		queryFn: getUsers,
	});

	const {
		data: postsData,
		error: postsError,
		isLoading: isPostsLoading,
		refetch: refetchGetPosts,
	} = useQuery<PostsResponseHttpData[]>({
		queryKey: ["getPosts"],
		queryFn: getPosts,
	});

	const {
		mutate: createPostMutation,
		isSuccess: isCreatePostSuccess,
		isPending: isCreatePostPending,
	} = useMutation({
		mutationFn: createPost,
		onSuccess: () => {
			console.log("onSuccess");
			queryClient.invalidateQueries({ queryKey: ["getPosts"] });
			queryClient.invalidateQueries({ queryKey: ["getUsers"] });
		},
	});

	// useEffect(() => {
	// 	if (isCreatePostSuccess && !isCreatePostPending) {
	// 		console.log("isCreatePostSuccess - Refetching Posts");
	// 		// refetchGetPosts();
	// 		queryClient.invalidateQueries({ queryKey: ["getPosts"] });
	// 		queryClient.invalidateQueries({ queryKey: ["getUsers"] });
	// 	}
	// }, [isCreatePostSuccess, isCreatePostPending, queryClient]);

	if (usersError && !isUsersLoading) {
		return <div>An error has occurred while fetching Users...</div>;
	}

	return (
		<div>
			<form
				onSubmit={(event) => {
					event.preventDefault();
					createPostMutation({
						title,
						body,
						userId: USER_ID,
					});
				}}
			>
				<label htmlFor="title">Title</label>
				<input
					name="title"
					id="title"
					value={title}
					onChange={(event) => {
						setTitle(event.target.value);
					}}
				/>
				<br />
				<label htmlFor="body">Body</label>
				<input
					name="body"
					id="body"
					value={body}
					onChange={(event) => {
						setBody(event.target.value);
					}}
				/>
				<button>Create Post</button>
			</form>
			<div>
				{!isPostsLoading &&
					postsData &&
					postsData.map((post) => (
						<div key={post.id}>
							<h1>{post.title}</h1>
							<p>{post.body}</p>
						</div>
					))}
			</div>
			{/* {!isUsersLoading && usersData ? (
				<div>
					{usersData.map((user) => (
						<div key={user.id}>
							<div>
								<b>{user.name}</b>
							</div>
							<div>
								<b>{user.username}</b>
							</div>
							<div>
								<b>{user.email}</b>
							</div>
						</div>
					))}
				</div>
			) : (
				<>Loading....</>
			)} */}
		</div>
	);
}

export default App;
