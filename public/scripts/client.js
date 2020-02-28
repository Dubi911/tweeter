/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(() => {
  // new tweet form handling
  $('#newTweetForm').submit(function(e) {
    e.preventDefault(); //prevent default behaviour of submit
    if (($('#tweetArea').val()).trim().length === 0) {
      $('#errLong').slideUp(500);
      $('#errNone').slideDown(1000);
      return;
    } else {
      if (Number($('#charCounter').text()) < 0) {
        $('#errNone').slideUp(500);
        $('#errLong').slideDown(1000);
        return;
      }
      const data = $('#newTweetForm').serialize();
      return $.ajax({
        method: "POST",
        url: 'http://localhost:8080/tweets',
        data: data //send data to server
      }).then(res => {
        $('#errLong').slideUp(500);
        $('#errNone').slideUp(500);
        $('#tweets-container').children().remove();
        loadTweets();
      });
    }
  });

  // click hand in nav show/hide form
  $('.write').click(function(e) {
    if ($('.new-tweet').attr('class') === 'new-tweet hide') {
      $('.new-tweet').show(1000);
      $('.new-tweet').removeClass('hide');
      $('.new-tweet').addClass('show');
      $('#tweetArea').focus();
    } else {
      $('.new-tweet').hide(1000);
      $('.new-tweet').removeClass('show');
      $('.new-tweet').addClass('hide');
    }
  });

  const loadTweets = () => { // load tweets on page load
    $.ajax('http://localhost:8080/tweets ',{
      method:'GET'
    })
      .then((tweets) => {
        renderTweets(tweets);
      });
  };
  
  // calculate time when tweet happened
  const calculateTime = t => {
    let ms = Date.now() - t;
    let ndate = new Date(ms);
    let sdate = ndate.toString();
    let arrdate = sdate.split(/[\s:]/g);
    
    arrdate2 = [ // get data from Date object and string splitting
      {value : Number(arrdate[3]) - 1970 ,for:'year(s)'},
      {value : ndate.getMonth()          ,for:'month(s)'},
      {value : Number(arrdate[2])        ,for:'day(s)'},
      {value : Number(arrdate[4])        ,for:'hour(s)'},
      {value : Number(arrdate[5])        ,for:'minute(s)'}
    ];
    //go through time unit and move down to shorter units
    let ANS = 0;
    arrdate2.forEach((el, i) => {
      if (el.value > 1) {
        ANS = el;
      }
      if (i === 4) {
        'Posted just now';
      }
    });
    return ANS === 'Posted just now' ? ANS : `Posted ${ANS.value} ${ANS.for} ago`;
  };
  
  const renderTweets = function(tweets) {
    // loops through tweets
    // calls createTweetElement for each tweet
    // takes return value and appends it to the tweets container
    tweets.forEach(tweet => {
      const newTweet = createTweetElement(tweet);
      newTweet.appendTo('#tweets-container');
    });
  };
  
  const createTweetElement = function(tweet) {
    let $tweet = $('<article>').addClass('tweet');
    
    $('<img>').attr('src',tweet.user.avatars).attr('alt',`${tweet.user.nam}`). addClass('avatar').appendTo($tweet);
    $('<span>').addClass('tweetUserName').text(`${tweet.user.name}`).appendTo($tweet);
    $('<span>').addClass('tweetHandle').text(tweet.user.handle).appendTo($tweet);
    $('<p>').addClass('tweetContent').text(tweet.content.text).appendTo($tweet);
    $('<hr>').appendTo($tweet);
    $('<span>').addClass('tweetDate').text(calculateTime(tweet.created_at)).appendTo($tweet);
    $(`<span>
    <a href="http://">&#10084;</a>
    <a href="http://">&#8645;</a>
    <a href="http://">⚐</a>
    </span>`).addClass('tweetOptions').appendTo($tweet);
    
    return $tweet;
  };
  loadTweets(); // call to load tweets after document renders
});