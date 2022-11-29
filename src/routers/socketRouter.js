/* eslint-disable comma-dangle */
/* eslint-disable brace-style */
/* eslint-disable consistent-return */
/* eslint-disable padded-blocks */
/* eslint-disable object-curly-newline */
// const { userValidator, addItemValidator, dateValidator } = require('../middleware/validator');
// const ItemSchema = require('../schemas/itemSchema');

const { userValidator } = require('../middleware/validator');
const { selectDiscussions, addDiscussion } = require('../model/discussionModel');
const { addPost } = require('../model/postModel');
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

    // %%% GAUTI VISUS TOPIC %%%
    socket.on('topics', async (data) => {
      // gauti vieną topic
      if (data) {
        const [item] = await selectOneTopic(data);
        socket.emit('oneItem', item);
      }

      // gauti visas topic
      else {
        const allTopics = await selectTopics();
        socket.emit('topics', allTopics);
      }
    });

    // ^^^ GAUTI VISAS DIKUSIJAS ^^^
    socket.on('discussions', async (topicid) => {
      const discussions = await selectDiscussions(topicid);
      socket.emit('discussions', discussions);
    });

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
        };
        const respPost = await addPost(newPost);
        const postId = respPost.insertId;
        socket.emit('addDisc', discId, postId);
      } catch (error) {
        socket.emit('serverError', {
          error: true,
          message: error,
        });
        console.log('error ===', error);
      }
    });
  });
};
