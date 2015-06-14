import React from 'react';
import querystring from 'querystring';
import { models } from 'snoode';

class CommentBox extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      inputCssClass: '',
      savedReply: props.savedReply || '',
    };
  }

  handleInputChange (e) {
    this.setState({savedReply: this.refs.text.value})
    var textEl = this.refs.text.getDOMNode();
    this.setState({
      inputCssClass: textEl.value.trim().length ? 'has-content' : '',
    });
  }
  
  componentDidMount () {
    if (this.props.savedReply) {
      this.setState({inputCssClass: 'has-content'});
    }
  }

  componentWillUnmount () {
    window.localStorage.clear();
  }
  
  componentWillReceiveProps (nextProps) {
    this.setState({savedReply: nextProps.savedReply})
  }

  submit (e) {
    e.preventDefault();
    var textEl = this.refs.text.getDOMNode();
    var text = textEl.value.trim();

    this.submitComment(this.props.thingId, text);
    textEl.value = '';
  }

  submitComment (thingId, text) {
    if (!this.props.token) {
      if (text) {
        window.localStorage.setItem(this.props.thingId, text);        
      }
      window.location = this.props.loginPath
      return;
    }

    if (!text) {
      return;
    }

    var comment = new models.Comment({
      thingId: thingId,
      text: text
    });

    var options = this.props.api.buildOptions(this.props.apiOptions);

    options = Object.assign(options, {
      model: comment,
    });

    var onSubmit = this.props.onSubmit.bind(this);

    this.props.api.comments.post(options).done((function(comment) {
      this.props.onSubmit(comment.data);
    }).bind(this));

    this.props.app.emit('comment', comment);
  }

  render () {
    var csrf;

    if(this.props.csrf) {
      csrf = (<input type='hidden' name='_csrf' value={ this.props.csrf } />);
    }

    return (
      <div className='row CommentBox'>
        <div className='col-xs-12'>
          <form action={ '/comment' } method='POST' onSubmit={ this.submit.bind(this) }>
            <input type='hidden' name='thingId' value={ this.props.thingId } />
            { csrf }
            <label className='sr-only' htmlFor={ 'textarea-' + this.props.thingId }>Comment</label>
            <textarea placeholder='Add your comment!' id={ 'textarea-' + this.props.thingId } rows='2'
                      className={ `form-control ${this.state.inputCssClass}` } name='text' ref='text'
                      onChange={ this.handleInputChange.bind(this) } value={ this.state.savedReply } ></textarea>
            <button type='submit' className='btn-post'>Post</button>
          </form>
        </div>
      </div>
    );
  }
}

CommentBox.defaultProps = {
  savedReply: '',
}

export default CommentBox;
