import { List, Space } from 'antd';
import React from 'react';

import { connect } from 'easy-soft-dva';
import {
  checkHasAuthority,
  checkInCollection,
  checkStringIsNullOrWhiteSpace,
  convertCollection,
  getValueByKey,
  isArray,
  showSimpleErrorMessage,
  sortCollectionByKey,
} from 'easy-soft-utility';

import {
  cardConfig,
  defaultEmptyImage,
  getDerivedStateFromPropertiesForUrlParameters,
  mobileTypeCollection,
} from 'antd-management-fast-common';
import {
  buildButton,
  buildCustomGrid,
  buildDropdownButton,
  buildListViewItemExtra,
  buildStatusBar,
  FlexBox,
  iconBuilder,
} from 'antd-management-fast-component';

import {
  accessWayCollection,
  keyValueItemData,
  keyValueTypeCollection,
} from '../../../../customConfig';
import { AddMediaItemDrawer } from '../../AddMediaItemDrawer';
import {
  removeMediaItemAction,
  setMediaCollectionSortAction,
} from '../../Assist/action';
import { parseUrlParametersForSetState } from '../../Assist/config';
import { MediaItemPreviewDrawer } from '../../MediaItemPreviewDrawer';
import { MobilePreviewBox } from '../../MobilePreviewBox';
import { TabPageBase } from '../../TabPageBase';
import { UpdateMediaItemDrawer } from '../../UpdateMediaItemDrawer';

@connect(({ section, schedulingControl }) => ({
  section,
  schedulingControl,
}))
class MediaInfo extends TabPageBase {
  componentAuthority = accessWayCollection.section.get.permission;

  constructor(properties) {
    super(properties);

    this.state = {
      ...this.state,
      loadApiPath: 'section/get',
      sectionId: null,
      mediaItemList: [],
      mediaItemCount: 0,
      currentMediaItem: null,
      selectForwardId: '',
    };
  }

  static getDerivedStateFromProps(nextProperties, previousState) {
    return getDerivedStateFromPropertiesForUrlParameters(
      nextProperties,
      previousState,
      { id: '' },
      parseUrlParametersForSetState,
    );
  }

  // eslint-disable-next-line no-unused-vars
  buildInitialValues = (metaData, metaListData, metaExtra, metaOriginalData) =>
    null;

  doOtherAfterLoadSuccess = ({
    metaData = null,
    // eslint-disable-next-line no-unused-vars
    metaListData = [],
    // eslint-disable-next-line no-unused-vars
    metaExtra = null,
    // eslint-disable-next-line no-unused-vars
    metaOriginalData = null,
  }) => {
    this.setCustomData(metaData);
  };

  setCustomData = (metaData) => {
    const { mediaItemList: mediaItemSourceList } = metaData;

    const mediaItemList = [];

    for (const item of mediaItemSourceList || []) {
      const o = {
        ...item,

        key: item.id,
        sort: item.sort + 1,
      };

      mediaItemList.push(o);
    }

    this.setState({
      metaData,
      mediaItemList,
      mediaItemCount: mediaItemList.length,
    });
  };

  showMediaItemPreviewDrawer = () => {
    MediaItemPreviewDrawer.open();
  };

  showInsertMediaItemDrawer = (record) => {
    this.setState(
      {
        selectForwardId: getValueByKey({
          data: record,
          key: keyValueItemData.id.name,
        }),
      },
      () => {
        AddMediaItemDrawer.open();
      },
    );
  };

  showAddMediaItemDrawer = () => {
    this.setState(
      {
        selectForwardId: '',
      },
      () => {
        AddMediaItemDrawer.open();
      },
    );
  };

  afterAddMediaItemDrawerOk = () => {
    this.refreshData({});
  };

  showUpdateMediaItemDrawer = (item) => {
    this.setState(
      {
        selectForwardId: '',
        currentMediaItem: item,
      },
      () => {
        UpdateMediaItemDrawer.open();
      },
    );
  };

  afterUpdateMediaItemDrawerOk = () => {
    this.refreshData({});
  };

  handleMenuClick = ({ key, handleData }) => {
    const { sectionId } = this.state;

    switch (key) {
      case 'insertItem': {
        this.showInsertMediaItemDrawer(handleData);
        break;
      }

      case 'moveUp': {
        this.changeSort(key, handleData);
        break;
      }

      case 'moveDown': {
        this.changeSort(key, handleData);
        break;
      }

      case 'removeItem': {
        removeMediaItemAction({
          target: this,
          handleData: { ...handleData, sectionId },
          successCallback: ({ target, remoteData }) => {
            target.setCustomData(remoteData);
          },
        });
        break;
      }

      default: {
        showSimpleErrorMessage('can not find matched key');
        break;
      }
    }
  };

  changeSort = (key, record) => {
    const { mediaItemList } = this.state;

    const list = sortCollectionByKey({
      operate: key,
      item: record,
      list: mediaItemList,
      sortKey: 'sort',
      sortMin: 1,
    });

    this.saveSortChangedMediaItem(list);
  };

  saveSortChangedMediaItem = (mediaItems) => {
    const { sectionId } = this.state;

    this.setState({ mediaItemList: mediaItems }, () => {
      const ids = (isArray(mediaItems) ? mediaItems : [])
        .map((o) => {
          const v = getValueByKey({
            data: o,
            key: keyValueItemData.id.name,
          });

          return v;
        })
        .join(',');

      setMediaCollectionSortAction({
        target: this,
        handleData: {
          sectionId,
          ids,
        },
      });
    });
  };

  renderPresetListView = (list) => {
    return (
      <List
        itemLayout="vertical"
        size="small"
        dataSource={list}
        renderItem={(item, index) => {
          return this.renderPresetListViewItem(item, index);
        }}
      />
    );
  };

  renderPresetListViewItem = (item, index) => {
    return (
      <List.Item>{this.renderPresetListViewItemInner(item, index)}</List.Item>
    );
  };

  // eslint-disable-next-line no-unused-vars
  renderPresetListViewItemInner = (item, index) => {
    const { mediaItemList } = this.state;

    const title = getValueByKey({
      data: item,
      key: keyValueItemData.title.name,
    });

    const type = getValueByKey({
      data: item,
      key: keyValueItemData.type.name,
      convert: convertCollection.number,
    });

    const text = getValueByKey({
      data: item,
      key: keyValueItemData.text.name,
    });

    const multiText = getValueByKey({
      data: item,
      key: keyValueItemData.multiText.name,
    });

    const image = getValueByKey({
      data: item,
      key: keyValueItemData.image.name,
    });

    const link = getValueByKey({
      data: item,
      key: keyValueItemData.link.name,
    });

    const video = getValueByKey({
      data: item,
      key: keyValueItemData.video.name,
    });

    const audio = getValueByKey({
      data: item,
      key: keyValueItemData.audio.name,
    });

    const attachment = getValueByKey({
      data: item,
      key: keyValueItemData.attachment.name,
    });

    const sort = getValueByKey({
      data: item,
      key: keyValueItemData.sort.name,
      convert: convertCollection.number,
    });

    const grid = buildCustomGrid({
      list: [
        {
          label: keyValueItemData.title.label,
          value: title,
        },
        {
          label: keyValueItemData.text.label,
          value: text,
          hidden: checkStringIsNullOrWhiteSpace(text),
        },
        {
          label: keyValueItemData.multiText.label,
          value: multiText,
          hidden: checkStringIsNullOrWhiteSpace(multiText),
        },
        {
          label: keyValueItemData.image.label,
          value: image,
          hidden: checkStringIsNullOrWhiteSpace(image),
        },
        {
          label: keyValueItemData.link.label,
          value: link,
          hidden: checkStringIsNullOrWhiteSpace(link),
        },
        {
          label: keyValueItemData.video.label,
          value: video,
          hidden: checkStringIsNullOrWhiteSpace(video),
        },
        {
          label: keyValueItemData.audio.label,
          value: audio,
          hidden: checkStringIsNullOrWhiteSpace(audio),
        },
        {
          label: keyValueItemData.attachment.label,
          value: attachment,
          hidden: checkStringIsNullOrWhiteSpace(attachment),
        },
      ],
      props: {
        bordered: true,
        column: 1,
        size: 'small',
        labelStyle: {
          width: '60px',
        },
        emptyValue: '暂无',
        emptyStyle: {
          color: '#ccc',
        },
        ellipsis: !checkInCollection(
          [keyValueTypeCollection.multiText, keyValueTypeCollection.link],
          type,
        ),
      },
    });

    return (
      <>
        <Space direction="vertical" style={{ width: '100%' }}>
          {checkStringIsNullOrWhiteSpace(image) ? (
            grid
          ) : (
            <FlexBox
              flexAuto="right"
              left={
                checkStringIsNullOrWhiteSpace(image)
                  ? null
                  : buildListViewItemExtra({
                      index,
                      align: 'top',
                      imageUrl: getValueByKey({
                        data: item,
                        key: keyValueItemData.image.name,
                      }),
                      emptyImageUrl: defaultEmptyImage,
                      width: '70px',
                    })
              }
              right={
                <div
                  style={{
                    paddingLeft: '20px',
                  }}
                >
                  {grid}
                </div>
              }
            />
          )}

          {buildStatusBar({
            actionList: [
              {
                label: keyValueItemData.id.label,
                text: getValueByKey({
                  data: item,
                  key: keyValueItemData.id.name,
                }),
                canCopy: true,
                color: '#999999',
              },
              {
                label: keyValueItemData.sort.label,
                text: sort,
                color: '#999999',
              },
              {
                label: keyValueItemData.createTime.label,
                text: getValueByKey({
                  data: item,
                  key: keyValueItemData.createTime.name,
                }),
                color: '#999999',
              },
            ],
            extra: buildDropdownButton({
              size: 'small',
              text: '编辑',
              placement: 'topRight',
              icon: iconBuilder.edit(),
              handleButtonClick: ({ handleData }) => {
                this.showUpdateMediaItemDrawer(handleData);
              },
              handleData: item,
              handleMenuClick: ({ key, handleData }) => {
                this.handleMenuClick({ key, handleData });
              },
              items: [
                {
                  key: 'insertItem',
                  icon: iconBuilder.insertRowBelow(),
                  text: '在下方插入',
                  hidden: !checkHasAuthority(
                    accessWayCollection.section.addMediaItem.permission,
                  ),
                },
                {
                  key: 'moveUp',
                  withDivider: true,
                  uponDivider: true,
                  icon: iconBuilder.arrowUp(),
                  text: '向上移动',
                  hidden: !checkHasAuthority(
                    accessWayCollection.section.updateSort.permission,
                  ),
                  disabled: sort === 1,
                },
                {
                  key: 'moveDown',
                  icon: iconBuilder.arrowDown(),
                  text: '向下移动',
                  hidden: !checkHasAuthority(
                    accessWayCollection.section.updateSort.permission,
                  ),
                  disabled: sort === (mediaItemList || []).length,
                },
                {
                  key: 'refreshCache',
                  withDivider: true,
                  uponDivider: true,
                  icon: iconBuilder.reload(),
                  text: '刷新缓存',
                  hidden: !checkHasAuthority(
                    accessWayCollection.section.refreshCache.permission,
                  ),
                  confirm: true,
                  title: '将要刷新缓存，确定吗？',
                },
                {
                  key: 'removeItem',
                  withDivider: true,
                  uponDivider: true,
                  icon: iconBuilder.delete(),
                  text: '删除信息',
                  hidden: !checkHasAuthority(
                    accessWayCollection.section.removeMediaItem.permission,
                  ),
                  confirm: true,
                  title: '将要删除信息，确定吗？',
                },
              ],
            }),
          })}
        </Space>
      </>
    );
  };

  establishToolBarConfig = () => {
    const { firstLoadSuccess, mediaItemCount } = this.state;

    return {
      stick: true,
      tools: [
        {
          title: '当前信息总数',
          component: (
            <>
              <span>当前信息总数：{mediaItemCount}</span>
            </>
          ),
        },
        {
          title: '新增图文媒体',
          component: buildButton({
            type: 'primary',
            icon: iconBuilder.addCircle(),
            text: '新增媒体',
            disabled:
              !firstLoadSuccess ||
              !checkHasAuthority(
                accessWayCollection.section.addMediaItem.permission,
              ),
            handleClick: (event) => {
              this.showAddMediaItemDrawer(event);
            },
          }),
        },
        {
          title: '预览图文',
          component: buildButton({
            type: 'default',
            icon: iconBuilder.eye(),
            text: '预览',
            disabled: !firstLoadSuccess,
            handleClick: () => {
              this.showMediaItemPreviewDrawer();
            },
          }),
        },
        {
          title: '刷新数据',
          component: this.renderPresetRefreshButton(),
        },
      ],
    };
  };

  establishHelpConfig = () => {
    return {
      title: '操作提示',
      list: [
        {
          text: '文章的构建将依照媒体顺序进行。',
        },
      ],
    };
  };

  establishCardCollectionConfig = () => {
    const { mediaItemList } = this.state;

    return {
      list: [
        {
          fullLine: false,
          width: '400px',
          cardBodyStyle: { padding: 0 },
          otherComponent: (
            <MobilePreviewBox
              style={{
                borderRadius: '8px 8px 0px 0px',
              }}
              mobileList={[
                mobileTypeCollection.noneSketch,
                mobileTypeCollection.roughSketch,
              ]}
              data={mediaItemList || []}
            />
          ),
        },
        {
          title: {
            text: '图片媒体列表',
          },
          fullLine: false,
          items: [
            {
              lg: 24,
              type: cardConfig.contentItemType.component,
              component: this.renderPresetListView(mediaItemList),
            },
          ],
        },
      ],
    };
  };

  renderPresetOther = () => {
    const { sectionId, mediaItemList, currentMediaItem, selectForwardId } =
      this.state;

    return (
      <>
        <AddMediaItemDrawer
          externalData={{
            sectionId,
            forwardId: selectForwardId,
          }}
          afterOK={() => {
            this.afterAddMediaItemDrawerOk();
          }}
        />

        <UpdateMediaItemDrawer
          externalData={{ ...currentMediaItem, sectionId }}
          afterOK={() => {
            this.afterUpdateMediaItemDrawerOk();
          }}
        />

        <MediaItemPreviewDrawer data={mediaItemList || []} />
      </>
    );
  };
}

export default MediaInfo;
