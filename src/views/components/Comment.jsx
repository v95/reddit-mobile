import React from 'react';
import moment from 'moment';

import Vote from '../components/Vote';
import CommentBox from '../components/CommentBox';
import MobileButton from '../components/MobileButton';
import ListingDropdown from '../components/ListingDropdown';
import ReplyIcon from '../components/icons/ReplyIcon';

import ReportPlaceholder from '../components/ReportPlaceholder';

import short from '../../lib/formatDifference';
import mobilify from '../../lib/mobilify';

class Comment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: this.props.comment,
      collapsed: this.props.comment.hidden,
      showReplyBox: false,
      showTools: false,
      favorited: false,
      optionsOpen: false,
      reported: false,
      savedReply: '',
      hidden: false,
    }
  }

  componentDidMount () {
    var savedReply = window.localStorage.getItem(this.props.comment.name);
    if (savedReply) {
      this.setState({
        savedReply: savedReply,
        showReplyBox: true,
        showTools: true,
      });
      var domNode = React.findDOMNode(this);
      domNode.scrollIntoView();
    }

    this.onReport = this.onReport.bind(this);
  }

  onReport () {
    this.setState({ reported: true });
  }

  onHide () {
    this.setState({ hidden: true });
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (nextProps !== this.props || nextState !== this.state);
  }

  // The collapsy icon
  collapse (e) {
    e.preventDefault();
    this.setState({
      collapsed: !this.state.collapsed,
      showTools: false,
      showReplyBox: false,
      optionsOpen: false,
    })
  }

  showReplyBox (e) {
    e.preventDefault();

    this.setState({
      showReplyBox: !this.state.showReplyBox,
    });
  }

  favorite (e) {
    e.preventDefault();

    this.setState({
      favorited: !this.state.favorited,
    });
  }

  openOptions (e) {
    e.preventDefault();

    this.setState({
      optionsOpen: !this.state.optionsOpen
    });
  }

  onNewComment (comment) {
    this.state.comment.replies = this.state.comment.replies || [];
    this.state.comment.replies.splice(0, 0, comment);

    this.setState({
      comment: this.state.comment,
      collapsed: false,
      showReplyBox: false,
      showTools: false,
      optionsOpen: false,
    });
  }

  showTools (e) {
    this.setState({ showTools: !this.state.showTools });
  }

  preventPropagation (e) {
    e.stopPropagation();
  }

  render () {
    if (this.state.hidden) {
      return (<div />);
    }

    if (this.state.reported) {
      return (<ReportPlaceholder />);
    }

    var props = this.props;
    var comment = this.state.comment;

    var authorFlair;
    var level = props.nestingLevel;
    var submitted = short(comment.created_utc * 1000);
    var op = props.op;

    var edited = props.edited ? '* ' : '';
    var opClass = '';
    var commentCollapseClass = '';
    var gilded;
    var children;
    var vote;

    var distinguished = comment.distinguished ? ' text-' + comment.distinguished : '';

    var scoreClass = 'up';

    var commentBox;
    var toolbox;
    var highlighted = '';

    var permalink;

    if (this.props.permalinkBase) {
      permalink = this.props.permalinkBase + comment.id;
    }

    if (this.state.showTools || props.highlight === comment.id) {
      highlighted = 'comment-highlighted';

      if (this.state.showReplyBox) {
        if (this.state.savedReply) {
          props.savedReply = this.state.savedReply;
        }
        commentBox = (
          <CommentBox ref='commentBox' {...props} thingId={ comment.name } onSubmit={ this.onNewComment.bind(this) }  />
        );
      }

      toolbox = (
        <ul className='linkbar-spread linkbar-spread-5 comment-toolbar clearfix'>
          <li>
            <MobileButton href='#' onClick={this.showReplyBox.bind(this)} className='comment-svg'>
              <ReplyIcon altered={this.state.showReplyBox}/>
            </MobileButton>
          </li>
          <li className='linkbar-spread-li-double comment-vote-container comment-svg'>
            <Vote
              app={this.props.app}
              thing={ this.props.comment }
              token={ this.props.token }
              api={ this.props.api }
              loginPath={ this.props.loginPath }
              apiOptions={ this.props.apiOptions }
            />
          </li>
          <li>
            <div className="encircle-icon encircle-options-icon">
              <ListingDropdown
                saved={ props.comment.saved }
                subreddit={ props.subredditName }
                permalink={ permalink }
                onReport={ this.onReport }
                token={ props.token }
                apiOptions={ props.apiOptions }
                listing={props.comment}
                app={props.app}/>
            </div>
          </li>
        </ul>
      );
    }

    if (comment.score < 0) {
      scoreClass = 'down';
    }

    if (comment.author_flair_text) {
      authorFlair = <span className={ 'label label-default ' + comment.author_flair_css_class }>
        { comment.author_flair_text }
      </span>;
    }

    if (op == comment.author) {
      opClass = 'comment-op';
    }

    var headerCollapseClass = '';
    var contentCollapseClass = '';

    if (this.state.collapsed) {
      headerCollapseClass = 'comment-header comment-collapsed';
      contentCollapseClass = 'comment-content comment-collapsed';
    }

    if (comment.gilded) {
      gilded = (
        <span className='icon-gold-circled'/>
      );
    }

    if (!this.state.collapsed) {
      if (comment.replies) {
        children = (
          <div className={ contentCollapseClass }>
            {
              comment.replies.map(function(c, i) {
                if (c) {
                  var key = 'page-comment-' + c.name + '-' + i;

                  return <Comment {...props} comment={c} key={key} nestingLevel={level + 1} op={op}/>;
                }
              })
            }
          </div>
        );
      }
    }

    var caretDirection = (this.state.collapsed) ? 'right' : 'bottom';

    return (
      <div className='comment'>
        <div className={ commentCollapseClass }>
          <article className={`comment-article ${highlighted}`}>
            <div className={'comment-submitted ' + headerCollapseClass}>
              <a href='#' onClick={ this.collapse.bind(this) }>
                <ul className='linkbar linkbar-compact comment-title-list'>
                  <li className={'comment-title-collapse-container twirly before' + (this.state.collapsed ? '' : ' opened')}>
                  </li>
                  <li className="comment-title-username">
                    <span className={ opClass + " " + distinguished }>
                      { comment.author }
                    </span>

                    { authorFlair }

                    { gilded }
                  </li>
                  <li className='comment-timestamp-score'>
                    <span className='comment-timestamp'>{ submitted }</span>
                    <span className='comment-title-score'>{ this.props.comment.score }</span>
                  </li>
                </ul>
              </a>
            </div>

            <div className={ `comment-body ${contentCollapseClass}` }>
              <div className='comment-content vertical-spacing-sm' dangerouslySetInnerHTML={{
                  __html: comment.body_html
                }}
                onClick={this.showTools.bind(this)} />

              <footer>
                { toolbox }
                { commentBox }
              </footer>
            </div>
          </article>

          { children }

        </div>
      </div>
    );
  }
}

export default Comment;
