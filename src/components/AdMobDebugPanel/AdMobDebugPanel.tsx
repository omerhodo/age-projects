'use client';

import { usePlatform } from '@/hooks';
import { useAdMobContext } from '@/providers/AdMobProvider';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import styles from './AdMobDebugPanel.module.scss';

const AdMobDebugPanel: React.FC = () => {
  const { isMobile } = usePlatform();
  const {
    isInitialized,
    isBannerVisible,
    isInterstitialReady,
    isRewardReady,
    showBanner,
    hideBanner,
    removeBanner,
    showInterstitial,
    showReward,
  } = useAdMobContext();

  const [showPanel, setShowPanel] = useState(false);

  if (!isMobile || process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setShowPanel(!showPanel)}
        variant='outlined'
        size='small'
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 9999,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        }}
      >
        AdMob Debug
      </Button>

      {showPanel && (
        <Card
          className={styles.debugPanel}
          style={{
            position: 'fixed',
            top: '50px',
            right: '10px',
            width: '300px',
            zIndex: 9998,
            maxHeight: '80vh',
            overflow: 'auto',
          }}
        >
          <CardContent>
            <Typography variant='h6' gutterBottom>
              AdMob Debug Panel
            </Typography>

            {/* Status */}
            <Box mb={2}>
              <Typography variant='subtitle2' gutterBottom>
                Status:
              </Typography>
              <Box display='flex' gap={1} flexWrap='wrap'>
                <Chip
                  label='Initialized'
                  color={isInitialized ? 'success' : 'error'}
                  size='small'
                />
                <Chip
                  label='Banner Visible'
                  color={isBannerVisible ? 'success' : 'default'}
                  size='small'
                />
                <Chip
                  label='Interstitial Ready'
                  color={isInterstitialReady ? 'success' : 'default'}
                  size='small'
                />
                <Chip
                  label='Reward Ready'
                  color={isRewardReady ? 'success' : 'default'}
                  size='small'
                />
              </Box>
            </Box>

            {!isInitialized && (
              <Alert severity='warning' sx={{ mb: 2 }}>
                AdMob is not initialized. Some features may not work.
              </Alert>
            )}

            {/* Banner Controls */}
            <Box mb={2}>
              <Typography variant='subtitle2' gutterBottom>
                Banner Controls:
              </Typography>
              <Box display='flex' gap={1} flexDirection='column'>
                <Button
                  variant='contained'
                  size='small'
                  onClick={showBanner}
                  disabled={!isInitialized}
                >
                  Show Banner
                </Button>
                <Button
                  variant='outlined'
                  size='small'
                  onClick={hideBanner}
                  disabled={!isInitialized || !isBannerVisible}
                >
                  Hide Banner
                </Button>
                <Button
                  variant='outlined'
                  size='small'
                  onClick={removeBanner}
                  disabled={!isInitialized || !isBannerVisible}
                >
                  Remove Banner
                </Button>
              </Box>
            </Box>

            {/* Interstitial Controls */}
            <Box mb={2}>
              <Typography variant='subtitle2' gutterBottom>
                Interstitial Controls:
              </Typography>
              <Button
                variant='contained'
                size='small'
                onClick={showInterstitial}
                disabled={!isInitialized || !isInterstitialReady}
                fullWidth
              >
                Show Interstitial
              </Button>
            </Box>

            {/* Reward Controls */}
            <Box mb={2}>
              <Typography variant='subtitle2' gutterBottom>
                Reward Controls:
              </Typography>
              <Button
                variant='contained'
                size='small'
                onClick={showReward}
                disabled={!isInitialized || !isRewardReady}
                fullWidth
              >
                Show Reward Ad
              </Button>
            </Box>

            {/* Info */}
            <Alert severity='info'>
              Bu panel sadece development modunda görünür. Production&apos;da
              otomatik olarak gizlenir.
            </Alert>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default AdMobDebugPanel;
