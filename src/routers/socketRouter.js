/* eslint-disable comma-dangle */
/* eslint-disable brace-style */
/* eslint-disable consistent-return */
/* eslint-disable padded-blocks */
/* eslint-disable object-curly-newline */
// const { userValidator, addItemValidator, dateValidator } = require('../middleware/validator');
// const ItemSchema = require('../schemas/itemSchema');

const { userValidator, postValidator } = require('../middleware/validator');
const {
  selectDiscussions,
  addDiscussion,
  selectOneDiscussion,
} = require('../model/discussionModel');
const { addPost, selectPosts, selectOnePost } = require('../model/postModel');
const { selectTopics, selectOneTopic } = require('../model/topicModel');

module.exports = (io) => {
  io.on('connection', (socket) => {
    // &&& PRISIJUNGTI PRIE KAMBARIO &&&
    socket.on('join', (roomId) => {
      socket.join(roomId);
    });
    // &&& ATSIJUNGTI NUO KAMBARIO &&&
    socket.on('leave', (roomId) => {
      socket.leave(roomId);
    });

    // %%% GAUTI TOPIC %%%
    socket.on('topics', async (data) => {
      // gauti vieną topic
      if (data) {
        const [item] = await selectOneTopic(data);
        socket.emit('oneTopic', item);
      }

      // gauti visas topic
      else {
        const allTopics = await selectTopics();
        socket.emit('topics', allTopics);
      }
    });

    // ^^^ GAUTI VISAS DIKUSIJAS ^^^
    socket.on('discussions', async (topicname) => {
      const discussions = await selectDiscussions(topicname);
      socket.emit('discussions', discussions);
    });
    // sukurti nauja diskusija
    socket.on('addDisc', async (data) => {
      const { secret, topicId, title, text } = data;
      const user = await userValidator(secret);
      if (!user) {
        return socket.emit('serverError', {
          error: true,
          message: 'you must log in to post',
        });
      }

      const newDisc = {
        topicId,
        title,
        author: user.id,
      };
      try {
        // idedam nauja diskusija i DB
        const respDisc = await addDiscussion(newDisc);
        console.log('respDisc ===', respDisc);
        const discId = respDisc.insertId;
        console.log('discId ===', discId);
        const newPost = {
          text,
          author: user.id,
          discId,
          replying: null,
        };
        await addPost(newPost);
        socket.emit('addDisc', discId);
      } catch (error) {
        socket.emit('serverError', {
          error: true,
          message: error,
        });
        console.log('error ===', error);
      }
    });

    // ^^^ GAUTI POSTUS ^^^
    socket.on('posts', async (discId) => {
      const [disc] = await selectOneDiscussion(discId);
      const posts = await selectPosts(discId);
      socket.emit('posts', disc, posts);
    });
    // gauti viena posta
    socket.on('post', async (postid) => {
      const [post] = await selectOnePost(postid);
      socket.emit('post', post);
    });

    // sukurti nauja posta
    socket.on('savepost', async (postObj) => {
      const { secret, text, discId, replying } = postObj;
      // user validation
      const user = await userValidator(secret);
      if (!user) {
        return socket.emit('serverError', {
          error: true,
          message: 'you must log in to post',
        });
      }
      // post validation
      const postError = await postValidator(postObj);
      if (postError) {
        return socket.emit('serverError', {
          error: true,
          message: postError,
        });
      }
      try {
        await addPost({ text, author: user.id, discId, replying });
        socket.emit('savepost', { error: false, message: 'Your post uploaded' });
        const [disc] = await selectOneDiscussion(discId);
        const posts = await selectPosts(discId);
        socket.emit('posts', disc, posts);
      } catch (error) {
        socket.emit('serverError', {
          error: true,
          message: error,
        });
      }
    });
  });
};
