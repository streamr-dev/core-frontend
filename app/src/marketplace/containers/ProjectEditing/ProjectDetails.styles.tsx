import styled from "styled-components"
import SvgIcon from "$shared/components/SvgIcon"
import {COLORS} from "$shared/utils/styled"

export const ProjectDetailIcon = styled(SvgIcon)`
  color: ${COLORS.primary};
  width: 16px;
  height: 16px;
  min-width: 16px;
  min-height: 16px;
  &.twitterColor {
    color: #1DA1F2;
  }
  &.telegramColor {
    color: #2AABEE;
  }
  &.redditColor {
    color: #FF5700;
  }
  &.linkedInColor {
    color: #0077B5;
  }
`
