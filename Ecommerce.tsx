import React from 'react'
import { Plugin } from '../plugins'
import './main.css'
import EcommerceDashboard from './ui'

interface Props {
  settings: Plugin
}

export default function WxEcommerce({
    settings,
}: Props) {
  return (
    <div className="popout dialog site__editor dialog__full __tool__edit web__editor__dialog Ecommerce">
      <div className="dialog__body">
          <div className="dialog__header">
            <h3 className="dialog__title">WX Ecommerce</h3>
          </div>
          <div className="dialog__content">
            <div className="dialog__body">
              <div className="auth__management__container">
                <EcommerceDashboard pluginSettings={settings} />
              </div>
          </div>
      </div>      
    </div>
    </div>
  )
}