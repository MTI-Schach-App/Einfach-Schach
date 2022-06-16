import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useStore } from '../../utils/store';
import { User } from '../../interfaces/user';
import { fetchWrapper } from '../../utils/fetch-wrapper';
import { useRouter } from 'next/router';

export default function SignIn() {
  const { setLoggedInState } = useStore();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const usersRepo: User[] = await fetchWrapper.get('api/users/all');
    const name = data.get('name').toString();

    if (
      usersRepo
        .flatMap((user) => user.displayName)
        .includes(data.get('name').toString())
    ) {
      setLoggedInState(
        usersRepo.filter((user) => user.displayName === name)[0]
      );
    } else {
      setLoggedInState({
        id: 0,
        name: name,
        displayName: name,
        level: 0,
        currentGame: '',
        currentCourse: '',
        dateUpdated: '0',
        dateCreated: '0',
        coursesFinished: [],
        wantsToClick: false
      });
      router.push('/signup');
    }
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Dein Name"
          name="name"
          autoComplete="name"
          autoFocus
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, height: 100, fontSize: 30 }}
        >
          Los gehts!
        </Button>
      </Box>
    </>
  );
}
