import { connect } from 'easy-soft-dva';
import { getValueByKey } from 'easy-soft-utility';

import { SyntaxHighlighter } from 'antd-management-fast-component';
import {
  DataDrawer,
  switchControlAssist,
} from 'antd-management-fast-framework';

const { BaseVerticalFlexDrawer } = DataDrawer;

const visibleFlag = '4a3ef38010d944e8992ec5a740c71f37';

@connect(({ accessWay, schedulingControl }) => ({
  accessWay,
  schedulingControl,
}))
class ActionMapDrawer extends BaseVerticalFlexDrawer {
  static open() {
    switchControlAssist.open(visibleFlag);
  }

  constructor(properties) {
    super(properties, visibleFlag);

    this.state = {
      ...this.state,
      pageTitle: '系统 Action Map 信息',
      loadApiPath: 'accessWay/getActionMap',
    };
  }

  establishHelpConfig = () => {
    return {
      title: '操作提示',
      list: [
        {
          text: '简要说明:这里是当前系统的 Action Map 信息。',
        },
      ],
    };
  };

  buildTitleSubText = () => {
    const { metaData } = this.state;

    return getValueByKey({
      data: metaData,
      key: 'description',
      defaultValue: '',
    });
  };

  renderPresetContentContainorInnerTop = () => {
    const { metaData } = this.state;

    const mapContent = getValueByKey({
      data: metaData,
      key: 'mapContent',
    });

    return (
      <div style={{ height: '100%', overflow: 'hidden' }}>
        <SyntaxHighlighter
          language="js"
          value={mapContent}
          other={{ showLineNumbers: true, wrapLines: true }}
          style={{
            height: 'calc(100% - 14px)',
            marginLeft: '10px',
            marginRight: '10px',
          }}
        />
      </div>
    );
  };
}

export { ActionMapDrawer };
