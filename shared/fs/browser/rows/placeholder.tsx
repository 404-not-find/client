import * as React from 'react'
import {rowStyles} from './common'
import * as Styles from '../../../styles'
import * as Types from '../../../constants/types/fs'
import * as Kb from '../../../common-adapters'

type PlaceholderProps = {
  type: Types.PathType.Folder | Types.PathType.File
}

export default ({type}: PlaceholderProps) => (
  <Kb.ListItem2
    type="Small"
    firstItem={true /* we add divider in Rows */}
    statusIcon={<Kb.Box />}
    icon={
      <Kb.Icon
        type={
          type === Types.PathType.Folder
            ? Kb.IconType.icon_folder_placeholder_32
            : Kb.IconType.icon_file_placeholder_32
        }
        style={rowStyles.pathItemIcon}
      />
    }
    body={
      <Kb.Box style={rowStyles.itemBox}>
        <Kb.Placeholder style={styles.placeholder} />
      </Kb.Box>
    }
  />
)

const styles = Styles.styleSheetCreate(
  () =>
    ({
      placeholder: {
        marginTop: 4,
      },
    } as const)
)
