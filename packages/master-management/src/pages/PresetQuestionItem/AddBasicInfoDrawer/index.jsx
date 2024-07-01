import { connect } from 'easy-soft-dva';
import { getValueByKey } from 'easy-soft-utility';

import { cardConfig } from 'antd-management-fast-common';
import {
  FunctionSupplement,
  iconBuilder,
} from 'antd-management-fast-component';
import {
  DataDrawer,
  switchControlAssist,
} from 'antd-management-fast-framework';

import { accessWayCollection } from '../../../customConfig';
import { fieldData } from '../Common/data';

const { BaseAddDrawer } = DataDrawer;

// 显隐控制标记, 必须设置, 标记需要全局唯一
const visibleFlag = '468e2b1af0dd4fadba37e470566167b6';
const {
  Whether: { renderFormWhetherSelect },
} = FunctionSupplement;

@connect(({ presetQuestionItem, schedulingControl }) => ({
  presetQuestionItem,
  schedulingControl,
}))
class AddBasicInfoDrawer extends BaseAddDrawer {
  // 在控制台显示组建内调用序列, 仅为进行开发辅助
  // showCallProcess = true;

  componentAuthority =
    accessWayCollection.presetQuestionItem.addBasicInfo.permission;

  static open() {
    switchControlAssist.open(visibleFlag);
  }

  constructor(properties) {
    super(properties, visibleFlag);

    this.state = {
      ...this.state,
      pageTitle: '新增选项',
      submitApiPath: 'presetQuestionItem/addBasicInfo',
      image: '',
    };
  }

  executeAfterDoOtherWhenChangeVisibleToShow = () => {
    this.setState({
      image: '',
    });
  };

  supplementSubmitRequestParams = (o) => {
    const d = { ...o };

    const { externalData, image } = this.state;

    const presetQuestionId = getValueByKey({
      data: externalData,
      key: fieldData.presetQuestionId.name,
      defaultValue: '',
    });

    d[fieldData.presetQuestionId.name] = presetQuestionId;
    d[fieldData.image.name] = image;

    return d;
  };

  afterImageUploadSuccess = (image) => {
    this.setState({ image: image });
  };

  fillDefaultInitialValues = () => {
    const values = {};

    values[fieldData.sort.name] = 0;

    return values;
  };

  establishCardCollectionConfig = () => {
    const { image } = this.state;

    return {
      list: [
        {
          title: {
            icon: iconBuilder.contacts(),
            text: '基本信息',
          },
          items: [
            {
              lg: 24,
              type: cardConfig.contentItemType.textarea,
              fieldData: fieldData.title,
              require: true,
            },
            {
              lg: 12,
              type: cardConfig.contentItemType.component,
              component: renderFormWhetherSelect({
                name: fieldData.whetherCorrect.name,
                label: fieldData.whetherCorrect.label,
                helper: fieldData.whetherCorrect.helper,
              }),
              require: true,
            },
            {
              lg: 12,
              type: cardConfig.contentItemType.inputNumber,
              fieldData: fieldData.sort,
              require: true,
            },
          ],
        },
        {
          title: {
            icon: iconBuilder.picture(),
            text: '图例上传',
            subText: '[上传后需点击保存按钮保存!]',
          },
          items: [
            {
              lg: 24,
              type: cardConfig.contentItemType.imageUpload,
              image: image,
              action: `/presetQuestionItem/uploadImage`,
              afterUploadSuccess: (imageData) => {
                this.afterImageUploadSuccess(imageData);
              },
            },
          ],
        },
        {
          title: {
            icon: iconBuilder.contacts(),
            text: '简介 - 描述 - 备注',
          },
          items: [
            {
              lg: 24,
              type: cardConfig.contentItemType.textarea,
              fieldData: fieldData.description,
            },
          ],
        },
        {
          title: {
            icon: iconBuilder.contacts(),
            text: '其他信息',
          },
          items: [
            {
              type: cardConfig.contentItemType.nowTime,
            },
          ],
        },
      ],
    };
  };
}

export { AddBasicInfoDrawer };
