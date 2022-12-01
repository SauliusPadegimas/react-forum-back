/* eslint-disable comma-dangle */
/* eslint-disable brace-style */
/* eslint-disable consistent-return */
/* eslint-disable padded-blocks */
/* eslint-disable object-curly-newline */
// const { userValidator, addItemValidator, dateValidator } = require('../middleware/validator');
// const ItemSchema = require('../schemas/itemSchema');

const { userValidator, postValidator, isImgLink } = require('../middleware/validator');
const {
  selectDiscussions,
  addDiscussion,
  selectOneDiscussion,
} = require('../model/discussionModel');
const { addPost, selectPosts, selectOnePost } = require('../model/postModel');
const { selectTopics, selectOneTopic } = require('../model/topicModel');
const { selectUsersPosts, updatetUserImg } = require('../model/userModel');
const { logedUsers } = require('../utils/helper');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
      console.log('disconecting socket', socket.id);
      const index = logedUsers.findIndex((object) => object.socket === socket.id);
      if (index !== -1) {
        logedUsers.splice(index, 1);
      }
    });
    // Disconnects socket on logout
    socket.on('forceDisconnect', () => socket.disconnect());

    // saved loged users to array
    socket.on('logedUsers', (userId) => {
      logedUsers.push({ socket: socket.id, userId });
      io.local.emit('logedUsers', logedUsers);
    });

    // ^^^ GAUTI USERIŲ POSTŲ SKAIČIŲ ^^^

    socket.on('usersPostsNum', async () => {
      const data = await selectUsersPosts();
      socket.emit('usersPostsNum', data);
    });

    // ### UPDATE IMG ###

    socket.on('updateImage', async (data) => {
      const { secret, imgUrl } = data;
      const user = await userValidator(secret);
      if (!user) {
        return socket.emit('serverError', {
          error: true,
          message: 'you must log in to post',
        });
      }
      const ifValidUrl = isImgLink(imgUrl);
      if (!ifValidUrl) {
        return socket.emit('serverError', {
          error: true,
          message: 'Bad img adress',
        });
      }
      try {
        const resp = await updatetUserImg(user.id, imgUrl);
        if (resp.affectedRows > 0) {
          socket.emit('updateImage', {
            error: false,
            message: 'Your avatar updated',
            data: imgUrl,
          });
        } else {
          socket.emit('serverError', {
            error: true,
            message: 'Error in DB. Try again later.',
          });
        }
      } catch (error) {
        socket.emit('serverError', {
          error: true,
          message: error,
        });
        console.log('error ===', error);
      }
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

    // ^^^ GAUTI DIKUSIJAS ^^^
    socket.on('discussions', async (topicname) => {
      const discussions = await selectDiscussions(topicname);
      socket.emit('discussions', discussions);
    });
    // gauti viena diskusija pagal id
    socket.on('getDiscussion', async (id) => {
      const [disc] = await selectOneDiscussion(id);
      socket.emit('getDiscussion', disc);
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
        const discId = respDisc.insertId;
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
      const postError = postValidator(postObj);
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
