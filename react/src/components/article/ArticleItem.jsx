import React from 'react'
import { message } from 'antd';
import * as api from '../../config/api'
import * as tool from '../../config/tools'
import {hashHistory} from 'react-router';
class ArticleItem extends React.Component {
	constructor(args) {
		super();
		this.state = {
			now_item: {
				
			}
		}
	}
	jump(item) {
		if (item.goodEssay !== '1' || item.userEssayOperation.isBuy === 1) {
			hashHistory.push(`/App/PersonalCenter/ArticleDetail/${item.essayId}`);
			return;
		}
		this.setState({
			now_item: item
		})
	}
	ok() {
		let body = {
			essayId: this.state.now_item.essayId
		}
		api.cashessay(body).then((data) => {
			if (data.result === 'RC100') {
				hashHistory.push(`/App/PersonalCenter/ArticleDetail/${this.state.now_item.essayId}`);
			} else {
				message.error(data.errMsg, 1);
			}
			tool.loading(this, false);
		}, (res) => {
			tool.loading(this, false);
			tool.reject(res);
		})
	}
	action(essayId,recordType){
		let body = {
			essayId,
			recordType
		};
		api.operateessay(body).then((data) => {
			if (data.result === 'RC100') {
				this.props.show();
			} else {
				message.error(data.errMsg, 1);
			}
			tool.loading(this, false);
		}, (res) => {
			tool.loading(this, false);
			tool.reject(res);
		})
	}
	click(item){
		if (item.goodEssay !== '1' || item.userEssayOperation.isBuy === 1) {
			this.action(item.essayId,1);
			return;
		}
		this.setState({
			now_item: item
		})
	}
	render(){
		let item = this.props.item;
		let isBuy = item.goodEssay ==='1' && item.userEssayOperation.isBuy !== 1;
		return(
              <div className="article-list" >
                <img className='head_img' onError={(e) => tool.headImageError(e)} alt='img' src={tool.getFile(item.headPath)} />
                <div className="cont">
                  <p className="info"><span>{item.userRealName}</span>{item.branchOffice}</p>
                  <p className="time">{tool.formatTimestamp(item.createTime)}</p>
                  <a onClick={()=>this.jump(item)}>
                  
                 
                  	 <article data-am-modal={isBuy?`{target: '#article-confirm${item.essayId}'}`:""} className="am-article">
                      <div className="am-article-hd">
                        <h1 className="am-article-title" style={{whiteSpace:'normal'}}>
                        {item.goodEssay === '1'?<div className="jc-icon" />:null}
						 {item.essayTitle ? tool.subString(item.essayTitle,25) : '没有文字'}
                        </h1>
                      </div>
                      <div className="am-article-bd">

                        <p className="am-article-lead shorthand">{item.essayNote ? tool.subString(item.essayNote,30) : '没有文字'}</p>

                        <ul className="am-avg-sm-3 am-thumbnails">
                        {item.essayPhotos.map((img,index)=>{
                          return(
                             <li key={index} ><img alt='test' src={tool.getFile(img.essayPhotoPath)} /></li>
                            )
                        })}
                        </ul>
                      </div>
                    </article>

                  </a>
                  <p className="like">
                  <span className={item.userEssayOperation.isCollection===1?'active':''} data-am-modal={isBuy?`{target: '#article-confirm${item.essayId}'}`:""} onClick={()=>this.click(item)} >
                  <i className="fa fa-heart-o" />{item.sumCollection}</span>
                  <span className={item.userEssayOperation.isLike===1?'active':''} onClick={()=>this.action(item.essayId,0)} >
                  <i className="fa fa-thumbs-o-up" />{item.sumLike}</span>
                  </p>
                </div>

      <div className="am-modal am-modal-confirm" tabIndex="-1" id={`article-confirm${item.essayId}`}>
       <div className="am-modal-dialog">
         <div className="am-modal-hd">温馨提示</div>
         <div className="am-modal-bd">
           兑换文章将需要{this.state.now_item.exchangeIntegral}积分，您的当前积分为{this.props.score}，是否继续？
         </div>
         <div className="am-modal-footer">
           <span className="am-modal-btn" data-am-modal-cancel>取消</span>
           <span className="am-modal-btn" data-am-modal-confirm onClick={()=>this.ok()}>确定</span>
         </div>
        </div>
       </div>

              </div>
			)
	}
}
export default ArticleItem;