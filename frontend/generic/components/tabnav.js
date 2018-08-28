import { cloneElement, Component } from 'react'
import PropTypes from 'prop-types'

import styles from '../styles/tabnav.css'


// A box that has tabs which can be navigated between
export default class TabNav extends Component {

  static propTypes = {
    tabs: PropTypes.array,
    defaultTab: PropTypes.number,
  }

  constructor(props) {
    super(props)
    this.state = {
      activeTabIdx: props.defaultTab || 0
    }
  }

  setActiveTab = tabIdx => e => {
    this.setState({
      activeTabIdx: tabIdx
    })
  }

  render() {
    const { children, tabs } = this.props
    const { activeTabIdx } = this.state
    return (
      <div className={styles.wrapper}>
        <div className={styles.tabList}>
          {tabs.map((tabName, idx) =>
            <div
              key={idx}
              className={`${styles.tabSelect} ${idx == activeTabIdx && styles.activeTab}`}
              onClick={this.setActiveTab(idx)}
            >
              { tabName }
            </div>
          )}
        </div>
        <div className={styles.tabBody}>
          {cloneElement(children[activeTabIdx], { setActiveTab: this.setActiveTab })}
        </div>
      </div>
    )
  }
}
