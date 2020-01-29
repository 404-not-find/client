import * as React from 'react'
import MessagePopupHeader from '../header'
import {FloatingMenu, MenuItem, MenuItems} from '../../../../../common-adapters'
import {fileUIName, StylesCrossPlatform} from '../../../../../styles'
import {DeviceType} from '../../../../../constants/types/devices'
import {Position} from '../../../../../common-adapters/relative-popup-hoc.types'

type Props = {
  attachTo?: () => React.Component<any> | null
  author: string
  deviceName: string
  deviceType: DeviceType
  deviceRevokedAt?: number
  onAddReaction?: () => void
  onAllMedia: () => void
  onDelete?: () => void
  onDownload?: () => void
  onHidden: () => void
  onInstallBot?: () => void
  onKick: () => void
  onPinMessage?: () => void
  onReply: () => void
  onSaveAttachment?: () => void
  onShareAttachment?: () => void
  onShowInFinder?: () => void
  pending: boolean
  position: Position
  style?: StylesCrossPlatform
  timestamp: number
  visible: boolean
  yourMessage: boolean
  isDeleteable: boolean
  isKickable: boolean
}

const AttachmentPopupMenu = (props: Props) => {
  const items: MenuItems = [
    ...(props.isDeleteable
      ? ([
          'Divider' as const,
          {
            danger: true,
            disabled: !props.onDelete,
            icon: Kb.IconType.iconfont_trash,
            onClick: props.onDelete,
            subTitle: 'Deletes this attachment for everyone',
            title: 'Delete',
          },
        ] as const)
      : []),
    ...(props.isKickable
      ? ([
          {
            danger: true,
            disabled: !props.onKick,
            icon: Kb.IconType.iconfont_block_user,
            onClick: props.onKick,
            subTitle: 'Removes the user from the team',
            title: 'Kick user',
          },
        ] as const)
      : []),
    'Divider' as const,
    ...(props.onShowInFinder
      ? [{icon: Kb.IconType.iconfont_finder, onClick: props.onShowInFinder, title: `Show in ${fileUIName}`}]
      : []),
    ...(props.onSaveAttachment
      ? [
          {
            disabled: props.pending,
            icon: Kb.IconType.iconfont_download_2,
            onClick: props.onSaveAttachment,
            title: 'Save',
          },
        ]
      : []),
    ...(props.onDownload
      ? [
          {
            disabled: props.pending,
            icon: Kb.IconType.iconfont_download_2,
            onClick: props.onDownload,
            title: 'Download',
          },
        ]
      : []),
    ...(props.onShareAttachment
      ? [
          {
            disabled: props.pending,
            icon: Kb.IconType.iconfont_share,
            onClick: props.onShareAttachment,
            title: 'Share',
          },
        ]
      : []),
    ...(props.onInstallBot
      ? [
          {
            disabled: props.pending,
            icon: Kb.IconType.iconfont_nav_2_robot,
            onClick: props.onInstallBot,
            title: 'Install bot in another team or chat',
          },
        ]
      : []),
    ...(props.onAllMedia
      ? [{icon: Kb.IconType.iconfont_camera, onClick: props.onAllMedia, title: 'All media'}]
      : []),
    ...(props.onAddReaction
      ? [{icon: Kb.IconType.iconfont_reacji, onClick: props.onAddReaction, title: 'Add a reaction'}]
      : []),
    ...(props.onReply ? [{icon: Kb.IconType.iconfont_reply, onClick: props.onReply, title: 'Reply'}] : []),
    ...(props.onPinMessage
      ? [{icon: Kb.IconType.iconfont_pin, onClick: props.onPinMessage, title: 'Pin message'}]
      : []),
  ].reduce<MenuItems>((arr, i) => {
    i && arr.push(i as MenuItem)
    return arr
  }, [])

  const header = {
    title: 'header',
    view: (
      <MessagePopupHeader
        author={props.author}
        deviceName={props.deviceName}
        deviceRevokedAt={props.deviceRevokedAt}
        deviceType={props.deviceType}
        isLast={!items.length}
        isLocation={false}
        timestamp={props.timestamp}
        yourMessage={props.yourMessage}
      />
    ),
  }
  return (
    <FloatingMenu
      attachTo={props.attachTo}
      header={header}
      items={items}
      onHidden={props.onHidden}
      closeOnSelect={true}
      position={props.position}
      positionFallbacks={[]}
      containerStyle={props.style}
      visible={props.visible}
    />
  )
}

export default AttachmentPopupMenu
