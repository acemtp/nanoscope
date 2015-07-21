Posts = new Mongo.Collection('posts');

Meteor.methods({
  post: function(title, url) {
    var A = Meteor.user();
    var post = {
        userId: A && A._id,
        author: A && A.emails[0].address,
        title: title,
        Url: url
      };

    Posts.insert(post);
        },
upvote: function(postId) {
    var user = Meteor.user();
    if (!user) return false;

    Posts.update({
      _id: postId,
      upvoters: {$ne: user._id}
    }, {
      $addToSet: {upvoters: user._id},
      $inc: {votes: 1}
    });
  }
});
