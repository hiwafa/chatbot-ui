import React, { useState, createContext, useContext, ReactNode } from 'react';
import { Modal, View, Text, StyleSheet, Button } from 'react-native';

interface ConfirmationDialogOptions {
  message: string;
  confirmText?: string;
  cancelText?: string;
}

interface ConfirmationDialogContextType {
  show: (options: ConfirmationDialogOptions) => Promise<boolean>;
}

const ConfirmationDialogContext = createContext<ConfirmationDialogContextType | undefined>(undefined);

export const ConfirmationDialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<ConfirmationDialogOptions | null>(null);
  const [resolvePromise, setResolvePromise] = useState<(value: boolean) => void>(() => () => {});

  const show = (options: ConfirmationDialogOptions): Promise<boolean> => {
    setOptions(options);
    setVisible(true);

    return new Promise((resolve) => {
      setResolvePromise(() => resolve);
    });
  };

  const handleConfirm = () => {
    setVisible(false);
    resolvePromise(true);
  };

  const handleCancel = () => {
    setVisible(false);
    resolvePromise(false);
  };

  return (
    <ConfirmationDialogContext.Provider value={{ show }}>
      {children}
      {visible && options && (
        <Modal transparent animationType="fade" visible={visible}>
          <View style={styles.overlay}>
            <View style={styles.dialog}>
              <Text style={styles.message}>{options.message}</Text>
              <View style={styles.buttonContainer}>
                <Button title={options.cancelText || 'Cancel'} onPress={handleCancel} color="#f44336" />
                <Button title={options.confirmText || 'Confirm'} onPress={handleConfirm} color="#4CAF50" />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </ConfirmationDialogContext.Provider>
  );
};

export const useConfirmationDialog = () => {
  const context = useContext(ConfirmationDialogContext);
  if (!context) {
    throw new Error('useConfirmationDialog must be used within a ConfirmationDialogProvider');
  }
  return context.show;
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialog: {
    maxWidth: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
    width: '100%',
  },
});
