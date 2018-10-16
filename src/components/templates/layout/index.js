import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import SEO from '../../atoms/seo';
import Header from '../../organisms/header';
import Footer from '../../organisms/footer';
import Sidebar from '../../molecules/sidebar';
import '../../../nucleon/nucleon.scss';
import './style.scss';

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrolledMenu: false,
      showSidebar: false
    };
  }

  componentDidMount = () => {
    if(typeof window !== 'undefined')
      window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount = () => {
    if(typeof window !== 'undefined')
      window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = (event) => this.setState({ scrolledMenu: event.srcElement.scrollingElement.scrollTop > 30 });
  handleShowSidebar = () => {
    this.setState({showSidebar: !this.state.showSidebar});
  }

  render() {
    const {children} = this.props;
    return (
      <StaticQuery
        query={graphql`{
          allSiteSettingEntitySite {
            edges {
              node {
                field_name
                field_footer
                field_keywords
                field_description
              }
            }
          }
        }
        `}
        render={data => {
          const {field_name, field_footer, field_keywords, field_description } = data.allSiteSettingEntitySite.edges[0].node
          const postData = {
            title: this.props.postTitle,
            description: this.props.postDesc,
            slug:this.props.postSlug,
            url:this.props.postUrl,
            datePublished: this.props.postDate
          };
          return (
          <>
            <SEO
              postData={postData} 
              postImage={this.props.postImage} 
              isBlogPost={this.props.isBlogPost} 
            />
            <div className="c-layout">
              <Sidebar showSidebar={this.state.showSidebar} hideSidebar={this.handleShowSidebar} />
              <div className="cell medium-cell-block">
                <Header scrolled={this.state.scrolledMenu} siteTitle={field_name} showSidebar={this.handleShowSidebar} darkMenu={this.props.darkMenu} />
                <div className="c-layout__main cell medium-cell-block">
                  {children}
                </div>
                <Footer showCta={this.props.showFooterCta} copyContent={field_footer} />
              </div>
            </div>
          </>
        )}}
      />
    )
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  postUrl: PropTypes.string.isRequired,
  postTitle: PropTypes.string.isRequired,
  darkMenu: PropTypes.bool,
  isBlogPost: PropTypes.bool,
  postImage: PropTypes.string,
  postSlug: PropTypes.string,
  postDesc: PropTypes.string,
  postDate: PropTypes.string
};

Layout.defaultProps = {
  darkMenu: false,
  isBlogPost: false
};

export default Layout;
