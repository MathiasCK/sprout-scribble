import { createPost, getPosts } from "~/server/actions";

const Home = async () => {
  const { success: posts, error } = await getPosts();
  console.log(posts);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {posts!.map(post => (
        <h1 key={post.id}>{post.title}</h1>
      ))}
      <form action={createPost}>
        <input type="text" name="title" placeholder="Post title" />
        <button type="submit">Create post</button>
      </form>
    </div>
  );
};

export default Home;
