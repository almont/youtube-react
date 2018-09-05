import 'assets/scss/App.scss'
import React from 'react'
import {getVideos} from '../youtube/api'
import Search from 'components/Search'
import VideoList from 'components/VideoList'
import Pagination from 'components/Pagination'
import Spinner from 'components/Spinner'
import VideoDetail from 'components/VideoDetail'
import Carousel from 'components/carousel/Carousel'


export default class App extends React.PureComponent {
  constructor() {
    super()
    this.state = {}
  }

  scrollUp() {
    var doc = document.documentElement
    var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)

    if (top > 0) {
      // window.scrollTo(0, top - 15)
      window.scrollTo(0, 0)
    }
  }

  onSearch(query, page = '') {
    this.setState({
        query: query,
        queryResult: undefined,
        prevPageToken: undefined,
        nextPageToken: undefined
      }, () => {
      getVideos(query, data => {
        this.setState({queryResult: data.data})
      }, page)
        if (page.length > 0) {
          this.scrollUp()
        }
    })
  }

  onPagination(prev, next) {
    this.setState({prevPageToken: prev, nextPageToken: next})
  }

  showDetail(data) {
    this.setState({videoDetail: data})
    this.scrollUp()
  }

  hideDetail() {
    this.setState({videoDetail: undefined})
  }

  renderResults() {
    if (this.state.videoDetail) {
      return (
        <VideoDetail data={this.state.videoDetail} hideDetail={this.hideDetail.bind(this)} />
      )
    } else {
      return (
        <div>
          {this.state.queryResult
            ? <VideoList data={this.state.queryResult} onPagination={this.onPagination.bind(this)} showDetail={this.showDetail.bind(this)} />
            : this.state.query && <Spinner />
          }

          {(this.state.prevPageToken || this.state.nextPageToken) &&
            <div>
              <Pagination onSearch={this.onSearch.bind(this)} query={this.state.query} prev={this.state.prevPageToken} next={this.state.nextPageToken} />
              <Carousel />
            </div>
          }
        </div>
      )
    }
  }

  render() {
    return (
      <div className="app">
        {/* <Search onSearch={this.onSearch.bind(this)} />
        {this.renderResults()} */}
        <Carousel />
      </div>
    )
  }
}