// ==============================================================================
// File: ModalStyle.jsx
// Purpose: Shared styled-components for modal dialogs (CreateGameModal, EditGameModal, etc.)
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-05-09
// ==============================================================================

import styled from "styled-components";
import { Segmented } from "antd";

// Wrapper around segmented control (e.g., Manual / JSON mode toggle)
export const SegmentedWrapper = styled(Segmented)`
  margin-bottom: 16px;
`;

// Upload block layout (picture card or JSON file area)
export const UploadSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// Wrapping form area to control spacing in modal
export const ModalFormContainer = styled.div`
  margin-top: 8px;
`;
